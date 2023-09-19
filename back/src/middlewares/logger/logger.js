const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata(),
        format.printf(({ level, message, metadata }) => {
            return `${level}:\n${message}${metadata === undefined ? '' : `\nMetadata: ${JSON.stringify(metadata, null, 2)}`}\n`;
        })
    ),
    transports: [
        new transports.File({ filename: 'info.log', level: process.env.LOG_LEVEL || 'info' })
    ]
});

module.exports = logger;