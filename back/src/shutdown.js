const storage = require('./db/storage');

const exit = (exitCode) => {
    console.log('Server is closed');
    storage.end();
    process.exit(exitCode);
};

function shutdown(server) {
    
    process.on('uncaughtException', (err) => {
        console.error('Uncaught exception:', err);
        server.close(() => exit(1));
    });
    
    process.on('unhandledRejection', (reason) => {
        console.error('Unhandled rejection, reason:', reason);
        server.close(() => exit(1));
    });
    
    process.on('SIGINT', () => {
        console.log('Server is shutting down');
        server.close(() => exit(0));
    });
}

module.exports = shutdown;