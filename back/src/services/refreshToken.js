const jwt = require('jsonwebtoken');
const util = require('util');

const storage = require('../db/storage');
const DtoUser = require('./dtoUser');
const Token = require('./token');
const ServerError = require('./errors/server');
const StorageError = require('./errors/storage');
const AuthError = require('./errors/auth');

const verify = util.promisify(jwt.verify);

class RefreshToken {
    constructor({ refreshToken }) {
        this.refreshToken = refreshToken;
    }

    refresh() {
        return verify(this.refreshToken, process.env.JWT_REFRESH_KEY)
            .then((decoded) => {
                return this.findTokenById(decoded.id)
            })
            .then((foundToken) => {
                if (foundToken?.token === this.refreshToken) {
                    return this.findUserById(foundToken.user_id);
                }

                throw new AuthError();
            })
            .then((foundUser) => {
                const dtoUser = new DtoUser(foundUser);
                const token = new Token({ ...dtoUser });

                return token.save(dtoUser.id);
            })
            .catch((err) => {
                throw err instanceof ServerError ? err : new AuthError();
            });
    }

    findTokenById(userId) {
        const query = `
            SELECT *
            FROM tokens
            WHERE user_id = ?;
        `;
        const values = [userId];

        return storage.query(query, values)
            .then(([[foundToken]]) => {
                return foundToken;
            })
            .catch((err) => {
                throw new StorageError('READ');
            });
    }

    findUserById(id) {
        const query = `
            SELECT *
            FROM users
            WHERE id = ?;
        `;
        const values = [id];

        return storage.query(query, values)
            .then(([[foundUser]]) => {
                return foundUser;
            })
            .catch((err) => {
                throw new StorageError('READ');
            });
    }
}

module.exports = RefreshToken;