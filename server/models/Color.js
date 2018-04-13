const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ColorModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const ColorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

//  rgb: {
//    type: String,
//    required: true,
//    trim: true,
//  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

ColorSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rgb: doc.rgb,
});

ColorSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return ColorModel.find(search).select('name').exec(callback);
};

ColorModel = mongoose.model('Color', ColorSchema);

module.exports.ColorModel = ColorModel;
module.exports.ColorSchema = ColorSchema;
