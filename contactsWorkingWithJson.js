const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const contactsList = await fs.readFile(contactsPath);
    return JSON.parse(contactsList);
  } catch (err) {
    console.log(err.message);
  }
}

async function getById(id) {
  try {
    const contacts = await listContacts();
    const findContact = contacts.find((contact) => contact.id === id);
    return findContact || null;
  } catch (err) {
    console.log(err.message);
  }
}

async function updateContacts(id, { email, name, phone }) {
  const contacts = await listContacts();
  const cotactChange = contacts.find((el) => el.id === id);
  if (!cotactChange) {
    return null;
  }
  cotactChange.email = email;
  cotactChange.name = name;
  cotactChange.phone = phone;
  await createNewList(contacts);
  return cotactChange;
}

async function createNewList(contacts) {
  try {
    const newContactsList = await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts)
    );
    return newContactsList;
  } catch (err) {
    console.log(err.massege);
  }
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = {
    id: String(Date.now()),
    email,
    name,
    phone,
  };

  contacts.push(newContact);

  await createNewList(contacts);

  return newContact;
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const id = String(contactId);
    const deletedContact = contacts.filter((el) => el.id !== id);

    if (deletedContact.length === contacts.length) {
      return null;
    }
    await createNewList(deletedContact);
    return deletedContact;
  } catch (err) {
    console.log(err.massege);
  }
}

module.exports = {
  listContacts,
  updateContacts,
  getById,
  addContact,
  removeContact,
};
