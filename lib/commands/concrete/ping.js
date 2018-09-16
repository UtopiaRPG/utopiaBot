module.exports = function () {

    return {
        private: true,
        public: true,
        name: 'ping',
        description: 'Ping!',
        execute(message, args) {
            message.reply('PONG!');
        },
    }
};