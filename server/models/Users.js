var thinky = require('thinky')();
var type = thinky.type;
var jwt = require('jsonwebtoken');

var UserSchema = thinky.createModel('User', {
    username: type.string().lowercase(),
    hash: type.string(),
    salt: type.string()
}, { pk: 'username'});

UserSchema.define('setPassword', function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
});

UserSchema.define('validPassword', function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
});

UserSchema.define('generateJWT', function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');
});

module.exports = UserSchema;