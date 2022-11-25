const { Contacts } = require("../model/contactsModel");

const listContacts = async (owner) => {
  return Contacts.find({ owner });
};

function getById(id, owner) {
  return Contacts.findById({ _id: id, owner });
}

function updateContacts(id, { email, name, phone, favorite }, owner) {
  return Contacts.findByIdAndUpdate(
    { _id: id },
    { name, email, phone, favorite },
    owner
  );
}

function addContact({ email, name, phone, favorite }, owner) {
  const contacts = new Contacts({ email, name, phone, favorite, owner });
  return contacts.save();
}

function removeContact(contactId) {
  return Contacts.findByIdAndRemove(contactId);
}

function updateStatusContact(id, { favorite }, owner) {
  return Contacts.findByIdAndUpdate(id, { $set: { favorite } }, owner);
}

module.exports = {
  listContacts,
  updateContacts,
  getById,
  addContact,
  removeContact,
  updateStatusContact,
};
