const express = require('express');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { createFile } = require("./utils");
const app = express();
const port = 3000;

const logConfiguration = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/server.log',
            level: 'info'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
};
const logger = winston.createLogger(logConfiguration);

app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.post('/log/:source', (req, res) => {
    const { level, log_string } = req.body;
    const source = req.params.source;
    const timestamp = new Date().toISOString();

    const logData = {
        level,
        log_string,
        timestamp,
        metadata: {
            source: `${source}.log`
        }
    };

    const logFilePath = `logs/${source}.log`;

    if (!fs.existsSync(logFilePath)) {
        createFile(logFilePath);
    }

    fs.appendFile(logFilePath, JSON.stringify(logData) + '\n', err => {
        if (err) {
            logger.error(`Error writing log: ${err.message}`);
            res.status(500).send('Error writing log');
        } else {
            logger.info(`Log written to ${source}.log`);
            res.sendStatus(200);
        }
    });
});

app.get('/search', (req, res) => {
    const { level, log_string, start, end, source } = req.query;
    const logFolderPath = path.join(__dirname, 'logs');

    try {
        const logFiles = fs.readdirSync(logFolderPath).filter(file => file.endsWith('.log'));

        const logs = [];

        logFiles.forEach(file => {
            const logFilePath = path.join(logFolderPath, file);
            const logData = fs.readFileSync(logFilePath, 'utf8').split('\n');

            logData.forEach(line => {
                if (line.trim() !== '') {
                    const log = JSON.parse(line);
                    const logTimestamp = new Date(log.timestamp).getTime(); 

                    
                    const regex = new RegExp(log_string, 'i');
                    const isLogStringMatched = !log_string || regex.test(log.log_string);

                    if ((!level || log.level === level) &&
                        isLogStringMatched &&
                        (!start || new Date(start).getTime() <= logTimestamp) && 
                        (!end || new Date(end).getTime() >= logTimestamp) &&     
                        (!source || (log.metadata && log.metadata.source.slice(0, -4) === source))) {
                        logs.push(log);
                    }
                }
            });
        });

        res.json(logs);
    } catch (err) {
        logger.error(`Error reading log files: ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    logger.info(`Server started at http://localhost:${port}`);
});
