const storage = require('../../db/storage');
const Message = require('./message');

class Image extends Message {
    constructor({ name }) {
        super({ text: name, type: 'image' });
    }
}

module.exports = Image;