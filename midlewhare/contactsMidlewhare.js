const { Contacts } = require("../model/contactsModel");

const listContacts = async () => {
  return Contacts.find({});
};

function getById(id) {
  return Contacts.findById(id);
}

function updateContacts(id, { email, name, phone, favorite }) {
  return Contacts.findByIdAndUpdate(
    { _id: id },
    { name, email, phone, favorite }
  );
}

function addContact(email, name, phone, favorite) {
  const contacts = new Contacts({ email, name, phone, favorite });
  return contacts.save();
}

function removeContact(contactId) {
  return Contacts.findByIdAndRemove(contactId);
}

function updateStatusContact(id, { favorite }) {
  return Contacts.findByIdAndUpdate(id, { $set: { favorite } });
}

module.exports = {
  listContacts,
  updateContacts,
  getById,
  addContact,
  removeContact,
  updateStatusContact,
};
