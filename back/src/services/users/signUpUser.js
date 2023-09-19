const bcrypt = require('bcrypt');
const uuid = require('uuid');

const storage = require('../../db/storage');
const DtoUser = require('../dtoUser');
const Token = require('../token');
const Email = require('../email');
const StorageError = require('../errors/storage');
const ClientError = require('../errors/client');

class SignUpUser {
    constructor({ name, email, password }) {
        this.name = name.trim();
        this.email = email.trim();
        this.password = password.trim();
    }

    signUp() {
        return this.findUser()
            .then((foundUser) => {
                if (!foundUser) {
                    const mail = new Email();
                    const link = uuid.v4();
    
                    return Promise.all([
                        bcrypt.hash(this.password, 10),
                        mail.send(this.email, link)
                    ]);
                }

                throw new ClientError('Sorry, but the provided email or username is already registered. Please use a different email or choose another username.', 409);
            })
            .then(([hash, activationLink]) => {
                return this.insertUser(hash, activationLink);
            })
            .then((id) => {
                const dtoUser = new DtoUser({ id: id, name: this.name, email: this.email });
                const token = new Token({ ...dtoUser });

                return token.save(id);
            })
            .catch((err) => {
                throw err;
            });
    }

    findUser() {
        const query = `
            SELECT *
            FROM users
            WHERE email = ?
            OR name = ?;
        `;
        const values = [this.email, this.name];

        return storage.query(query, values)
            .then(([[foundUser]]) => {
                return foundUser;
            })
            .catch((err) => {
                throw new StorageError('READ');
            });
    }

    insertUser(hash, link) {
        const query = `
            INSERT INTO users (name, email, password, activation_link)
            VALUES (?, ?, ?, ?);
        `;
        const values = [this.name, this.email, hash, link];

        return storage.query(query, values)
            .then(([res]) => {
                return res.insertId;
            })
            .catch((err) => {
                throw new StorageError('CREATE');
            });
    }
}

module.exports = SignUpUser;