// server/controllers/contactsControllers.js

const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET  /api/contacts
//@access private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user_id: req.user.id }); // get all the contacts of specified user.
    res.status(200).json(contacts);
  } catch (err) {
    console.log(err);
  }
};

//@desc Create new contact
//@route POST  /api/contacts
//@access private
const createContact = async (req, res) => {
  console.log("The request body is: " + req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }

  console.log(req.user.id);
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
};

//@desc Get contact
//@route GET  /api/contacts:id
//@access private
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }
    res.status(200).json(contact);
  } catch (err) {
    console.log(err);
  }
};

//@desc Update contacts
//@route PUT  /api/contacts:id
//@access private
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }

    if (contact.user_id !== req.user.id) {
      // means that different users try to update a contact of another user.
      res.status(404);
      throw new Error(
        "User don't have permission to update other user contacts"
      );
    }
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedContact);
  } catch (err) {
    console.log(err);
  }
};

//@desc Delete the contacts
//@route DELETE  /api/contacts/:id
//@access private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404);
      throw new Error("Contact not found");
    }

    if (contact.user_id !== req.user.id) {
      // means that different users try to delete a contact of another user.
      res.status(404);
      throw new Error(
        "User don't have permission to update other user contacts"
      );
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
