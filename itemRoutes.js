"use strict";

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { BadRequestError } = require("./expressError");


/** GET /items: get list of items */
router.get("/", function (req, res) {
  return res.json({ items: db.items });
});

/** POST /items: add item to item list and return item */
router.post("/", function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  const item = req.body;
  db.items.push(item);

  return res.json({ add: item });
});



/** DELETE /users/[id]: delete user, return {message: Deleted} */
// router.delete("/:id", function (req, res) {
//   db.User.delete(req.params.id);
//   return res.json({ message: "Deleted" });
// });


module.exports = router;