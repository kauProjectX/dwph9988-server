const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const path = require("path");
const appRoot = require("app-root-path");

const { createLogger } = require("winston");
const process = require("process");

const logDir = `${appRoot}/logs`;

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(label({ label: "ProjectX " })),
});
