// server/routes/contactsRoutes.js

const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactsControllers");

router.use(validateToken); // Because all routes are private

router.route("/").get(getContacts).post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
