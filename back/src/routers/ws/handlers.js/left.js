const Message = require('../../../services/chat/message');
const Event = require('./event');

class LeftEvent extends Event {
    constructor(io, socket) {
        super(io, socket);
    }

    static name() {
        return 'left';
    }

    handler(data) {
        const message = new Message({ type: 'left' });

        message.addMessage(this.socket.userId, this.socket.roomId)
            .then((messageId) => {
                this.broadcastAvoid(JSON.stringify({
                    event: 'message',
                    data: {
                        name: this.socket.user,
                        type: 'left'
                    }
                }), this.socket.roomId);

                this.socket.emit('left', JSON.stringify({
                    event: 'left',
                    data: {
                        message: 'The client can be disconnected'
                    }
                }));
            })
            .catch((err) => {
                console.error(err);

                this.socket.emit('error', JSON.stringify({
                    event: 'error',
                    data: {
                        message: 'Error while leaving'
                    }
                }));
            });
    }
}

module.exports = LeftEvent;
