'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Teacup Schema
 */
var TeacupSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    scheduleDate: {
        type: Date,
        default: Date.now
        },
    description: {
        type: String,
        default: '',
        trim: true
    },
    speaker: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    subscribedusers: [{
        type: Schema.ObjectId,
        ref: 'User'        
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comments: [{
        createdwhen: {
            type: Date,
            default: Date.now
        },
        createdby: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
            default: '',
            trim: true
        }
    }]
});

/**
 * Validations
 */
TeacupSchema.path('title').validate(function (title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
TeacupSchema.statics.load = function (id, populate, cb) {
    var populateobjects = (populate !== null && populate === 'true' ? 'user speaker' : 'user');
    this.findOne({
        _id: id
    })
    .populate(populateobjects)
    .populate('subscribedusers')
    .populate('comments.createdby')
    .exec(cb);
};

mongoose.model('Teacup', TeacupSchema);
