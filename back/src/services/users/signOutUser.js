const storage = require('../../db/storage');
const StorageError = require('../errors/storage');

class SignOutUser {
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    signOut() {
        const query = `
            DELETE FROM tokens
            WHERE token = ?;
        `;
        const values = [this.refreshToken];

        return storage.query(query, values)
            .then(([res]) => {
                return;
            })
            .catch((err) => {
                throw new StorageError('DELETE');
            });
    }
}

module.exports = SignOutUser;