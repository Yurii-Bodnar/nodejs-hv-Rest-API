const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ContactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: String,
    ref: "user",
  },
});
ContactsSchema.plugin(uniqueValidator);
const Contacts = mongoose.model("contatcs", ContactsSchema);

module.exports = { Contacts };
