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


};

mongoose.model('Teacup', UserSchema);

