import { useState, useMemo, useEffect } from "react";
import { Table, Form, FormControl } from "react-bootstrap";
import Axios from "axios";
import "./AdminPortal.css";

enum LogLevel {
  Info = 'Info',
  Warn = 'Warn',
  Error = 'Error'
}

interface Log {
  level: LogLevel;
  message: string;
  timestamp: Date;
}

function Logs() {
  const [logs, setLogs] = useState<Log[]>([
    { level: LogLevel.Info, message: 'Info log 1', timestamp: new Date() },
    { level: LogLevel.Warn, message: 'Warn log 2', timestamp: new Date() },
    { level: LogLevel.Error, message: 'Error log 3', timestamp: new Date() },
    // Add more logs as needed
  ]);
  const [logLevel, setLogLevel] = useState<LogLevel | "">("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => logLevel === "" || log.level === logLevel)
      .filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [logs, logLevel, searchTerm]);

  const infoLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Info), [filteredLogs]);
  const warnLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Warn), [filteredLogs]);
  const errorLogs = useMemo(() => filteredLogs.filter(log => log.level === LogLevel.Error), [filteredLogs]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await Axios.get<Log[]>(import.meta.env.VITE_APP_CLIENT_API_BASE_URL + "/api/get-logs", {
        withCredentials: true
      });

      setLogs(response.data);
    };

    fetchLogs();
  }, [])

  const handleLogLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLogLevel(event.target.value as LogLevel);
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

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
                <FormControl type="text" placeholder="Search" className="mb-2 mr-sm-2" value={searchTerm} onChange={handleSearchTermChange} />
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
      
export default Logs;