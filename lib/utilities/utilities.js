class utilities {
    static generateToken() {
        return Math.random().toString( 36 ).substr( 2 );
    };
}

module.exports = utilities;