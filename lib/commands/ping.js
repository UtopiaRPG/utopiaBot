module.exports = function () {

    return {
        name: 'ping',
        description: 'Ping!',
        execute(forum, message, args) {
            message.reply('PONG!');
        },
    }
};