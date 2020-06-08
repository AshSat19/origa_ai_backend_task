const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    no_of_orders: { type: Number, default: 0 }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
