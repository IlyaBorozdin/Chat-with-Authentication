const storage = require('../../db/storage');

class User {
    constructor({ name }) {
        this.name = name;
    }

    getUser() {
        const query = `
            SELECT id
            FROM users
            WHERE name = ?;
        `;
        const values = [this.name];
    
        return storage.query(query, values)
            .then(([rows]) => {
                if (rows.length > 0) {
                    return rows[0].id;
                } else {
                    throw new Error('User not found');
                }
            })
            .catch((err) => {
                throw new Error('Error fetching user');
            });
    }
}

module.exports = User;
