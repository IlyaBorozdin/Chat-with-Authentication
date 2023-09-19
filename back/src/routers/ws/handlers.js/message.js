const Message = require('../../../services/chat/message');
const Event = require('./event');

class MessageEvent extends Event {
    constructor(io, socket) {
        super(io, socket);
    }

    static name() {
        return 'message';
    }

    handler(data) {
        const message = new Message(data);

        message.addMessage(this.socket.userId, this.socket.roomId)
            .then((messageId) => {
                this.broadcast(JSON.stringify({
                    event: 'message',
                    data: data
                }), this.socket.roomId);
            })
            .catch((err) => {
                console.error(err);

                this.socket.emit('error', JSON.stringify({
                    event: 'error',
                    data: {
                        message: 'Error while chatting'
                    }
                }));
            });
    }
}

module.exports = MessageEvent;
