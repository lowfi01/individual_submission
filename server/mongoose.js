/* eslint-disable */


// Connection to NoSQL (Mongodb, using Mongoose schema)


// Connection to Mongodb using Mongoose
var mongoose = require(`mongoose`);

// Allows us to use promises, or Await / Async with all data references
mongoose.Promise = global.Promise;

// Local Host connection
mongoose.connect(`mongodb://localhost:27017/SmartLockSystem`, { useMongoClient: true });

module.exports = {
    mongoose
};


