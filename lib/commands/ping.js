module.exports = function () {

    return {
        name: 'ping',
        description: 'Ping!',
        execute(message, args) {
            message.reply('PONG!');
        },
    }
};