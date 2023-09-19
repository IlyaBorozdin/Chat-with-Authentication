const JoinEvent = require("./join");
const LeftEvent = require("./left");
const MessageEvent = require('./message');

module.exports = {
    [JoinEvent.name()]: JoinEvent,
    [MessageEvent.name()]: MessageEvent,
    [LeftEvent.name()]: LeftEvent
};