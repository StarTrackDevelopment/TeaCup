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
    },
    office: {
        type: String,
        default: '',
        trim: true
    },
    capacity: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    instrumentation: {
        projector: {
            type: Boolean,
            default: false
        },
        tv: {
            type: Boolean,
            default: false
        },
        dockingStation: {
            type: Boolean,
            default: false
        },
        network: {
            type: Boolean,
            default: false
        },
        videoMeeting: {
            type: Boolean,
            default: false
        }
    }
});

/**
 * Validations
 */
RoomSchema.path('name').validate(function(name) {
    return name.length;
}, 'Name cannot be blank');

RoomSchema.path('office').validate(function (office) {
    return office.length;
}, 'Office cannot be blank');


/**
 * Statics
 */
RoomSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    })
    .populate('user')
    .exec(cb);
};

mongoose.model('Room', RoomSchema);
