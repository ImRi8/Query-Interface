const fs = require('fs');

const defaultLogs = '';

const createFile = (file) => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, defaultLogs);
    }
};

module.exports = {
    createFile
};
