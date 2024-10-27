const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const appRoot = require('app-root-path');
const fs = require('fs');

const { createLogger } = require('winston');

const logDir = `${appRoot}/logs`;

// 로그 디렉토리 생성 확인
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, label, printf } = winston.format;

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// 로그 설정
const logger = createLogger({
  level: 'info', // 기본 로그 레벨 설정
  format: combine(label({ label: 'ProjectX' }), timestamp(), logFormat),
  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30, // 30일 간 로그 파일 유지
      zippedArchive: true,
    }),
    new winston.transports.Console({
      level: 'debug', // 콘솔 로그 레벨 설정
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  exitOnError: false, // 오류 발생 시 프로세스 종료 방지
});

// logger 사용 예시 (테스트용)
logger.info('Logger is set up and running!');

module.exports = logger;
