const express = require("express");
const {
  listContacts,
  updateContacts,
  getById,
  addContact,
  removeContact,
  updateStatusContact,
} = require("../../midlewhare/contactsMidlewhare");
const { authAutorization } = require("../../midlewhare/authAutorization");
const router = express.Router();
const {
  schema,
  schemaContactFavorite,
} = require("../../validationJoi/validationJoi");

router.use(authAutorization);

router.get("/", async (req, res, next) => {
  if (req.user === null) {
    return res.status(401).json({ message: "Not authorized" });
  }
  const { _id } = req.user;
  const contacts = await listContacts(_id);
  res.status(200).json({ contacts, status: "success" });
});

router.get("/:id", async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  const contact = await getById(id, _id);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json({ contact, status: "success" });
});

router.post("/", async (req, res, next) => {
  const validationRes = schema.validate(req.body);
  if (validationRes.error) {
    return res.status(400).json({ message: "missing required name field" });
  }
  try {
    const { email, name, phone } = req.body;

    const { _id } = req.user;
    await addContact({ email, name, phone }, _id);
    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { _id: owner } = req.user;
  const deletedContact = await removeContact(req.params.id, { id: owner });

  deletedContact
    ? res.status(200).json({ message: "contact deleted" })
    : res.status(404).json({ message: "Not found" });
});

router.put("/:id", async (req, res, next) => {
  const validationRes = schema.validate(req.body);
  if (validationRes.error) {
    return res.status(400).json({ message: "missing fields" });
  }
  const { _id: owner } = req.user;
  const { id } = req.params;
  const contact = await updateContacts(id, req.body, { _id: owner });
  contact
    ? res.status(200).json({
        massage: "success",
      })
    : res.status(404).json({
        message: "Not found",
      });
});

router.patch("/:id/favorite", async (req, res, nex) => {
  const validationRes = schemaContactFavorite.validate(req.body);
  if (validationRes.error) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const { _id: owner } = req.user;
    const contact = await updateStatusContact(req.params.id, req.body, {
      _id: owner,
    });
    contact
      ? res.status(200).json({
          massage: "success",
        })
      : res.status(404).json({
          message: "Not found",
        });
  } catch (err) {
    res.status(404).json(err.message);
  }
});

module.exports = router;
