const storage = require('../../db/storage');

class Message {
    constructor({ text = '', type = 'message' }) {
        this.text = text;
        this.type = type;
    }

    static readMessages(roomId) {
        const query = `
            SELECT u.name AS name, m.type AS type, m.text AS text
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.room_id = ?
            ORDER BY m.id;
        `;
        const values = [roomId];

        return storage.query(query, values)
            .then(([res]) => {
                return res;
            })
            .catch((err) => {
                throw new Error('Error reading messages');
            });
    }

    addMessage(userId, roomId) {
        const query = `
            INSERT INTO messages (user_id, room_id, type, text)
            VALUES (?, ?, ?, ?);
        `;
        const values = [userId, roomId, this.type, this.text];
    
        return storage.query(query, values)
            .then(([res]) => {
                return res.insertId;
            })
            .catch((err) => {
                throw new Error('Error adding message');
            });
    }
}

module.exports = Message;