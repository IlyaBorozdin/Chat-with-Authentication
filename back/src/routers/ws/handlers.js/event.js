class Event {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    static name() {
        return 'event';
    }

    handler(data) {
        throw new Error('Should be implemented.');
    }

    broadcast(clientMessage, roomId) {
        this.io.to(roomId).emit(JSON.parse(clientMessage).event, clientMessage);
    }

    broadcastAvoid(clientMessage, roomId) {
        this.socket.to(roomId).broadcast.emit(JSON.parse(clientMessage).event, clientMessage);
    }
}

module.exports = Event;
