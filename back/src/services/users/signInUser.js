const bcrypt = require('bcrypt');

const storage = require('../../db/storage');
const Token = require('../token');
const DtoUser = require('../dtoUser');
const StorageError = require('../errors/storage');
const ClientError = require('../errors/client');

class SignInUser {
    constructor({ name, password }) {
        this.name = name.trim();
        this.password = password.trim();
    }

    signIn() {
        let dtoUser;

        return this.findUserByName()
            .then((foundUser) => {
                if (foundUser) {
                    dtoUser = new DtoUser(foundUser);
                    return bcrypt.compare(this.password, foundUser.password);
                }

                throw new ClientError(
                    'Oops! It seems there was an issue with your login attempt. Please double-check your credentials and try again. If you haven\'t registered yet, please sign up to create an account. If you\'re still having trouble, feel free to contact our support team.'
                );
            })
            .then((isMatch) => {
                if (isMatch) {
                    const token = new Token({ ...dtoUser });
                    return token.save(dtoUser.id);
                }

                throw new ClientError(
                    'Oops! It looks like the password you entered is incorrect. Please double-check your password and try again. If you continue to have trouble, you can reset your password or contact our support team for assistance.'
                );
            })
            .catch((err) => {
                throw err;
            });
    }

    findUserByName() {
        const query = `
        SELECT *
        FROM users
        WHERE name = ?;
    `;
    const values = [this.name];

    return storage.query(query, values)
        .then(([[foundUser]]) => {
            return foundUser;
        })
        .catch((err) => {
            throw new StorageError('READ');
        });
    }
}

module.exports = SignInUser;