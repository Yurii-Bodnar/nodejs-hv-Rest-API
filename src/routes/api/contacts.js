const express = require("express");

const { authAutorization } = require("../../midlewhare/authAutorization");
const router = express.Router();
const {
  getContacts,
  getByIdContacts,
  postContact,
  deleteContact,
  update,
  updateStatus,
} = require("../../contactsService/contactsService");

router.use(authAutorization);

router.get("/", async (req, res, next) => {
  try {
    getContacts(req, res);
  } catch (err) {
    next(res.status(404).json({ message: err.message }));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    getByIdContacts(req, res);
  } catch (err) {
    next(res.status(404).send(err.message));
  }
});

router.post("/", async (req, res, next) => {
  try {
    postContact(req, res);
  } catch (err) {
    next(res.status(404).send(err.message));
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    deleteContact(req, res);
  } catch (err) {
    next(res.status(404).send(err.message));
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    update(req, res);
  } catch (err) {
    next(res.status(404).send(err.message));
  }
});

router.patch("/:id/favorite", async (req, res, next) => {
  try {
    updateStatus(req, res);
  } catch (err) {
    next(res.status(404).send(err.message));
  }
});

module.exports = router;
