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
    description: {
        type: String,
        default: '',
        trim: true
    },
    scheduledate: {
        type: Date,
        default: Date.now
    },
    speaker: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

/**
 * Validations
 */
TeacupSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
TeacupSchema.statics.load = function (id, populate, cb) {
    var populateobjects = (populate != null && populate === "true" ? 'user speaker' : 'user');
    this.findOne({
        _id: id
    }).populate(populateobjects, 'name username').exec(cb);    
};

mongoose.model('Teacup', TeacupSchema);
