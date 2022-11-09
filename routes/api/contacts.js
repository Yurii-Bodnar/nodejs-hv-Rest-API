const express = require("express");
const {
  listContacts,
  updateContacts,
  getById,
  addContact,
  removeContact,
} = require("../../contactsWorkingWithJson");
const router = express.Router();
const joiValidation = require("../../validationJoi/validationJoi");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({ contacts, status: "success" });
});

router.get("/:id", async (req, res, next) => {
  const contact = await getById(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ contact, status: "success" });
});

router.post("/", async (req, res, next) => {
  const validationRes = joiValidation.validate(req.body);
  if (validationRes.error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  const { email, name, phone } = req.body;
  await addContact(email, name, phone);
  res.status(201).json({ status: "success" });
});

router.delete("/:id", async (req, res, next) => {
  const deletedContact = await removeContact(req.params.id);

  deletedContact
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:id", async (req, res, next) => {
  const validationRes = joiValidation.validate(req.body);
  if (validationRes.error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await updateContacts(req.params.id, req.body);
  contact
    ? res.status(200).json({
        massage: "success",
      })
    : res.status(404).json({
        message: "Not found",
      });
});

module.exports = router;
