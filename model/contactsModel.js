const mongoose = require("mongoose");

const ContactsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});
const Contacts = mongoose.model("contatcs", ContactsSchema);

module.exports = { Contacts };
