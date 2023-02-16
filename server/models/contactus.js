const mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    firstName : String,lastName:String,
    email: String,
    password: String
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;