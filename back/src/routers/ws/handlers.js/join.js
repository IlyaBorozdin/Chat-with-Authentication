const Message = require('../../../services/chat/message');
const Room = require('../../../services/chat/room');
const User = require('../../../services/chat/user');
const Event = require('./event');

class JoinEvent extends Event {
    constructor(io, socket) {
        super(io, socket);
    }

    static name() {
        return 'join';
    }

    handler(data) {
        const user = new User(data.user);
        const room = new Room(data.room);

        Promise.all([
            user.getUser(),
            room.addRoom()
        ])
            .then(([userId, roomId]) => {
                this.socket.join(roomId);

                this.socket.user = user.name;
                this.socket.room = room.name;
                this.socket.userId = userId;
                this.socket.roomId = roomId;

                const res = {
                    event: 'joined',
                    data: {
                        userId: userId,
                        roomId: roomId
                    }
                };

                const message = new Message({ type: 'join' });
                return message.addMessage(userId, roomId)
                    .then((messageId) => {

                        this.broadcastAvoid(JSON.stringify({
                            event: 'message',
                            data: {
                                name: user.name,
                                type: 'join'
                            }
                        }), roomId);

                        return Message.readMessages(roomId)
                            .then((data) => {
                                res.data.text = data;
                                this.socket.emit('message', JSON.stringify(res));
                            });
                    });
            })
            .catch((err) => {
                console.error(err);
                this.socket.emit('error', JSON.stringify({
                    event: 'error',
                    data: {
                        message: 'Error while joining'
                    }
                }));
            });
    }
}

module.exports = JoinEvent;
