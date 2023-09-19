const socketIo = require('socket.io');

const mapEvent = require('./handlers/mapEvent');

function wsRouter(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Client connected');

        for (const eventName in mapEvent) {
            if (Object.prototype.hasOwnProperty.call(mapEvent, eventName)) {
                socket.on(eventName, (data) => {
                    const event = new mapEvent[eventName](io, socket);
                    event.handler(data);
                });
            }
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = wsRouter;
