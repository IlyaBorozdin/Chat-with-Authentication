const Image = require('../../../services/chat/image');
const Event = require('./event');

class ImageEvent extends Event {
    constructor(io, socket) {
        super(io, socket);
    }

    static name() {
        return 'image';
    }

    handler(data) {
        const image = new Image(data);

        image.addImage(this.socket.userId, this.socket.roomId)
            .then((messageId) => {
                this.broadcast(JSON.stringify({
                    event: 'message',
                    data: {
                        user: user.name,
                        name: data.path,
                        type: 'image'
                    }
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

module.exports = ImageEvent;
