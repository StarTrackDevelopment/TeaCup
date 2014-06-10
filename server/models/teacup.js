/**
 * Created by chris_000 on 09.06.2014.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var TeacupSchema = new Schema({
    titel: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Titel cannot be blank']
    },
    speaker: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        validate: [validatePresenceOf, 'Speaker-Email cannot be blank']
    },
    description: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'description cannot be blank']
    },
    date: {
        type: Date,
        required: true,
        validate: [validatePresenceOf, 'date cannot be blank']
    }
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
        return next(new Error('Invalid password'));
    next();
});


};

mongoose.model('Teacup', UserSchema);

