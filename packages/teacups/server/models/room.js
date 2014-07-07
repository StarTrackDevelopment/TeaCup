'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Room Schema
 */
var RoomSchema = new Schema({
   name: {
        type: String,
        default: '',
        trim: true
    }
});

/**
 * Validations
 */
RoomSchema.path('name').validate(function (name) {
    return name.length;
}, 'Room name cannot be blank');

mongoose.model('Room', RoomSchema);
