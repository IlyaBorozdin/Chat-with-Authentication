const storage = require('../../db/storage');
const StorageError = require('../errors/storage');
const ClientError = require('../errors/client');

class ActivateUser {
    constructor(link) {
        this.link = link;
    }

    activate() {
        return this.findUserByLink()
            .then((foundUser) => {
                if (foundUser) {
                    if (!foundUser.is_activated) {
                        return this.turnOnUser(foundUser.id);
                    }

                    throw new ClientError(
                        'Oops! It appears that you have already successfully verified your account using the provided link. You can now log in to your account. If you have any further questions or concerns, please feel free to get in touch with our support team.',
                        409
                    );
                }

                throw new ClientError(
                    'Oops! It looks like you\'ve tried to use an inactive registration link. Please make sure you\'re using the correct link and try again. If you continue to experience issues, please don\'t hesitate to reach out to our support team for assistance.'
                );
            })
            .catch((err) => {
                throw err;
            })
    }

    findUserByLink() {
        const query = `
            SELECT *
            FROM users
            WHERE activation_link = ?;
        `;
        const values = [this.link];

        return storage.query(query, values)
            .then(([[foundUser]]) => {
                return foundUser;
            })
            .catch((err) => {
                throw new StorageError('READ');
            });
    }

    turnOnUser(id) {
        const query = `
            UPDATE users
            SET is_activated = 1
            WHERE id = ?;
        `;
        const values = [id];

        return storage.query(query, values)
            .then(([res]) => {
                return true;
            })
            .catch((err) => {
                throw new StorageError('UPDATE');
            });
    }
}

module.exports = ActivateUser;