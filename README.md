# Log Ingestor and Query Interface

## Project Overview

This project implements a robust log ingestion and querying system. It captures logs from multiple APIs, standardizes their format, and provides a user-friendly interface for querying logs based on various filters. This system is designed to be scalable and efficient, capable of handling high volumes of logs with quick search capabilities.

## Features

### Log Ingestor

1. **API Integration:**
    - Integrates multiple APIs (8-9) to capture logs.
    - Each API writes logs to designated files (e.g., `log1.log`, `log2.log`).

2. **Log Formatting:**
    - Standardized format includes timestamp, log level, source, log message, etc.

3. **Logging Configuration:**
    - Configurable logging levels and file paths via a configuration file or environment variables.

4. **Error Handling:**
    - Robust error handling ensures logging failures do not disrupt application functionality.
    - Scalable to handle high volumes of logs efficiently.
    - Mitigates potential bottlenecks (I/O operations, database write speeds).

### Query Interface

- Provides a web-based user interface for full-text search across logs.
- Filters based on:
    - Level
    - Log string
    - Timestamp
    - Metadata source

### Advanced Features (Bonus)

- Search within specific date ranges.
- Regular expressions for search.
- Combining multiple filters.
- Real-time log ingestion and searching capabilities.
- Role-based access to the query interface.

## Installation and Setup

1. **Clone the Repository:**
    ```sh
    git clone https://github.com/yourusername/log-ingestor-query-interface.git
    cd log-ingestor-query-interface
    ```

2. **Install Dependencies:**
    ```sh
    npm install
    ```

3. **Configuration:**
    - Create a `.env` file in the root directory to configure logging levels and file paths.
    ```env
    LOG_LEVEL=info
    LOG_PATH=logs
    ```

4. **Run the Server:**
    ```sh
    npm start
    ```

    The server will start at `http://localhost:3000`.

## Project Structure

- `public/`: Contains static files including `search.html`.
- `logs/`: Directory where log files are stored.
- `utils.js`: Contains utility functions such as `createFile`.
- `app.js`: Main application file.

## API Endpoints

### Log Ingestion

- **POST `/log/:source`**
    - **Description:** Ingest logs from different APIs.
    - **Parameters:**
        - `source` (path parameter): Source of the log (e.g., `api1`, `api2`).
    - **Body:**
        ```json
        {
            "level": "error",
            "log_string": "Inside the api",
            "timestamp": "2024-05-14T12:33:16.739Z",
            "metadata": {
                "source": "log1.log"
            }
        }
        ```
        ```json
        {
            "level": "success",
            "log_string": "success",
            "timestamp": "2024-05-14T12:29:34.715Z",
            "metadata": {
                "source": "log2.log"
            }
        }
        ```
    - **Response:** `200 OK` on success, `500 Internal Server Error` on failure.

### Log Search

- **GET `/search`**
    - **Description:** Search logs based on filters.
    - **Parameters:**
        - `level` (query parameter): Log level to filter by.
        - `log_string` (query parameter): Log string to search for.
        - `start` (query parameter): Start timestamp for filtering logs.
        - `end` (query parameter): End timestamp for filtering logs.
        - `source` (query parameter): Source of the logs to filter by.
    - **Response:** JSON array of matching logs.