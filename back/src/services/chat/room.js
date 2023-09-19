const storage = require('../../db/storage');

class Room {
    constructor({ name }) {
        this.name = name;
    }

    addRoom() {
        const query = `
            INSERT INTO rooms (name)
            VALUES (?)
            ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);
        `;
        const values = [this.name];
    
        return storage.query(query, values)
            .then(([res]) => {
                return res.insertId;
            })
            .catch((err) => {
                throw new Error('Error adding room');
            });
    }
}

module.exports = Room;