const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const orderSchema = mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    subtotal: { type: Number, required: true },
    date: { type: String, required: true }
});

orderSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Order', orderSchema);
