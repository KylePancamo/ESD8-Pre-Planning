import { useState, useMemo, useEffect } from "react";
import { Table, Form, FormControl } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import useDebounce from "./useDebounce"; // Debounce custom hook


import Axios from "axios";
import "./AdminPortal.css";

enum LogLevel {
    Info = 'info',
    Warn = 'warn',
    Error = 'error'
}

interface Log {
    level: LogLevel;
    message: string;
    timestamp: string;
}

const LogViewer = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [logLevel, setLogLevel] = useState<LogLevel | "">("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searchTimestamp, setSearchTimestamp] = useState<string>("");

    const debouncedSearchTerm = useDebounce(searchTerm, 200); // Debounce the search term
    const debouncedSearchTimestamp = useDebounce(searchTimestamp, 200); // Debounce the search timestamp

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => logLevel === "" || log.level === logLevel)
            .filter(log => log.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            .filter(log  => {
                if (debouncedSearchTimestamp === "") return true;
                const timestampFormat = log.timestamp.split(" ")[0];
                const timeFormat = log.timestamp.split(" ")[1].split(":").slice(0, 2).join(":");
                const logTimestamp = `${timestampFormat} ${timeFormat}`;
                return logTimestamp.includes(debouncedSearchTimestamp);
            })
    }, [logs, logLevel, debouncedSearchTerm, debouncedSearchTimestamp]);

    const infoLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Info), [filteredLogs]);
    const warnLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Warn), [filteredLogs]);
    const errorLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Error), [filteredLogs]);

    useEffect(() => {
        const fetchLogs = async () => {
            const response = await Axios.get(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-logs", {
                withCredentials: true
            });
            console.log(response.data.logs)
            setLogs(response.data.logs);
        };

        fetchLogs();
    }, [])

    const handleLogLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLogLevel(event.target.value as LogLevel);
    };

    const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchTimestampChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTimestamp(event.target.value);
    };

    if (logs.length === 0) {
        return (
            <>
                <Spinner animation="border" variant="primary" />
            </>
        );
    }

    if (logs.length > 0) {
        return (
            <div className="logs-user-container">
                <h2>Log Viewer</h2>
                <Form className="search-form">
                <Form.Select className="mb-2 mr-sm-2" aria-label="Log Level" value={logLevel} onChange={handleLogLevelChange}>
                        <option value="">All Levels</option>
                        {Object.values(LogLevel).map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                </Form.Select>
                <FormControl type="text" placeholder="Search by message" className="mb-2 mr-sm-2" value={searchTerm} onChange={handleSearchTermChange} />
                <FormControl placeholder="Search Timestamp" className="mb-2 mr-sm-2" value={searchTimestamp} onChange={handleSearchTimestampChange} />
                </Form>
                <div className="logs-tables-container">
                    {(!logLevel || logLevel === LogLevel.Info) && (
                        <div className="logs-table-container">
                            <h3>Info</h3>
                            <Table striped bordered hover className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Message</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {infoLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.message}</td>
                                            <td>{log.timestamp.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                    {(!logLevel || logLevel === LogLevel.Warn) && (
                        <div className="logs-table-container">
                            <h3>Warn</h3>
                            <Table striped bordered hover className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Message</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warnLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.message}</td>
                                            <td>{log.timestamp.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                    {(!logLevel || logLevel === LogLevel.Error) && (
                        <div className="logs-table-container">
                            <h3>Error</h3>
                            <Table striped bordered hover className="logs-table">
                                <thead>
                                    <tr>
                                        <th>Message</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {errorLogs.map((log, index) => (
                                        <tr key={index}>
                                            <td>{log.message}</td>
                                            <td>{log.timestamp.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default LogViewer;