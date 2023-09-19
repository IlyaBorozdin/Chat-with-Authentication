const jwt = require('jsonwebtoken');

const storage = require('../db/storage');
const StorageError = require('./errors/storage');

class Token {
    constructor(payload) {
        this.accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: '30m'});
        this.refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '30d'});
    }

    save(userId) {
        return this.insertToken(userId)
            .then((id) => {
                return this;
            })
            .catch((err) => {
                throw err;
            })
    }

    insertToken(userId) {
        const query = `
            INSERT INTO tokens (user_id, token)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE
            token = VALUES(token);
        `;
        const values = [userId, this.refreshToken];

        return storage.query(query, values)
            .then(([res]) => {
                return res.insertId;
            })
            .catch((err) => {
                throw new StorageError('CREATE');
            })
    }
}

module.exports = Token;