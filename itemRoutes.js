"use strict";

const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError, BadRequestError } = require("./expressError");


/** GET /items: get list of items */
router.get("/", function (req, res) {
  return res.json({ items: db.items });
});

/** POST /items: add item to item list and return item */
router.post("/", function (req, res) {
  if (req.body === undefined) throw new BadRequestError('Item required.');

  const item = req.body;
  db.items.push(item);

  return res.json({ add: item });
});

/** GET /items/:name: return single item */
router.get("/:name", function (req, res) {
  const item = db.items.find(item => item.name === req.params.name);

  if (item === undefined) {
    throw new NotFoundError(`${req.params.name} not found.`);
  }

  return res.json(item);
});

/** PATCH /items/:name: accept JSON body with info to modify, modify item, and
 * return item. */
router.patch("/:name", function (req, res) {
  const item = db.items.find(item => item.name === req.params.name);

  if (item === undefined) {
    throw new NotFoundError(`${req.params.name} not found.`);
  }

  item.name = req.body.name || item.name;
  item.price = req.body.price || item.price;

  console.log(item.name)

  return res.json({updated: item});
});


/* DELETE /item/:name: delete item, return {message: Deleted} */
router.delete("/:name", function (req, res) {
  const idx = db.items.findIndex(item => item.name === req.params.name);

  if (idx === -1) {
    throw new NotFoundError(`${req.params.name} not found.`);
  }

  db.items.splice(idx, 1);

  return res.json({ message: "Deleted" });
});


module.exports = router;