import fs from 'fs';
import path from 'path';

/**
 * Logger utility for application logging
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logsDir: string;
  private errorLogFile: string;
  private combinedLogFile: string;
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogFiles: number = 5;

  constructor() {
    this.logsDir = path.join(process.cwd(), 'logs');
    this.errorLogFile = path.join(this.logsDir, 'error.log');
    this.combinedLogFile = path.join(this.logsDir, 'combined.log');
    this.ensureLogDirectory();
  }

  /**
   * Ensure logs directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  /**
   * Format log entry
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, data, stack } = entry;
    let logMessage = `[${timestamp}] [${level}] ${message}`;

    if (data) {
      logMessage += `\nData: ${JSON.stringify(data, null, 2)}`;
    }

    if (stack) {
      logMessage += `\nStack: ${stack}`;
    }

    return logMessage + '\n';
  }

  /**
   * Write log to file
   */
  private writeToFile(filePath: string, content: string): void {
    try {
      // Check file size and rotate if needed
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size >= this.maxLogSize) {
          this.rotateLogFile(filePath);
        }
      }

      fs.appendFileSync(filePath, content, 'utf8');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  /**
   * Rotate log file when it exceeds max size
   */
  private rotateLogFile(filePath: string): void {
    try {
      const ext = path.extname(filePath);
      const basename = path.basename(filePath, ext);
      const dirname = path.dirname(filePath);

      // Shift existing rotated files
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const oldFile = path.join(dirname, `${basename}.${i}${ext}`);
        const newFile = path.join(dirname, `${basename}.${i + 1}${ext}`);

        if (fs.existsSync(oldFile)) {
          if (i === this.maxLogFiles - 1) {
            fs.unlinkSync(oldFile); // Delete oldest file
          } else {
            fs.renameSync(oldFile, newFile);
          }
        }
      }

      // Rotate current file
      const rotatedFile = path.join(dirname, `${basename}.1${ext}`);
      fs.renameSync(filePath, rotatedFile);
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  /**
   * Log a message
   */
  private log(level: LogLevel, message: string, data?: any, stack?: string): void {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = { timestamp, level, message, data, stack };
    const formattedLog = this.formatLogEntry(entry);

    // Console output with colors
    const consoleMessage = this.getColoredConsoleMessage(level, message, data);
    console.log(consoleMessage);

    // Write to combined log
    this.writeToFile(this.combinedLogFile, formattedLog);

    // Write errors to error log
    if (level === LogLevel.ERROR) {
      this.writeToFile(this.errorLogFile, formattedLog);
    }
  }

  /**
   * Get colored console message
   */
  private getColoredConsoleMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const colors = {
      ERROR: '\x1b[31m', // Red
      WARN: '\x1b[33m', // Yellow
      INFO: '\x1b[36m', // Cyan
      DEBUG: '\x1b[35m', // Magenta
    };
    const reset = '\x1b[0m';
    const color = colors[level] || reset;

    let consoleMessage = `${color}[${timestamp}] [${level}]${reset} ${message}`;
    if (data) {
      consoleMessage += `\n${JSON.stringify(data, null, 2)}`;
    }

    return consoleMessage;
  }

  /**
   * Log error
   */
  error(message: string, error?: Error | any): void {
    const data = error && typeof error === 'object' ? {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
    } : error;

    const stack = error?.stack;
    this.log(LogLevel.ERROR, message, data, stack);
  }

  /**
   * Log warning
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log info
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log debug
   */
  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(method: string, url: string, statusCode: number, duration: number): void {
    const message = `${method} ${url} ${statusCode} - ${duration}ms`;
    if (statusCode >= 500) {
      this.error(message);
    } else if (statusCode >= 400) {
      this.warn(message);
    } else {
      this.info(message);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
