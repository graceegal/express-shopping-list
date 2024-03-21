"use strict";

const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

let item = {name: "popsicle", "price": 1.45};

beforeEach(function() {
  db.items.push(item);
});

afterEach(function() {
  db.items = [];
});


// TEST GET ITEMS

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /items", function() {
  it("Gets a list of items", async function() {
    const resp = await request(app).get(`/items`);

    expect(resp.body).toEqual({ items: [item] });
  });
});


/** POST /items - create item from data; return `{added: {item}}` */

describe("POST /items", function() {
  it("Creates a new item successfully", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "cheerios",
        price: 3.50
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added: { name: "cheerios", price: 3.50}});
  });

  it("Create a new item without price", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        name: "cheerios"
      });
    expect(resp.body.error.status).toEqual(400);
    expect(resp.body.error.message).toEqual('Missing item information.');
  });

  it("Create a new item without name", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send({
        price: 3.50
      });
    expect(resp.body.error.status).toEqual(400);
    expect(resp.body.error.message).toEqual('Missing item information.');
  });

  it("Create a new item with no data", async function() {
    const resp = await request(app)
      .post(`/items`)
      .send();
    expect(resp.body.error.status).toEqual(400);
    expect(resp.body.error.message).toEqual('Item required.');
  });

});


/** GET /items/:name: - get item by name. return item `{name, price}` */

describe("GET /items/:name", function() {
  it("Update an item successfully", async function() {
    const resp = await request(app)
      .get(`/items/${item.name}`)
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(item);
  });

  it("Update an item that doesn't exist", async function() {
    const resp = await request(app)
      .get(`/items/doesnt_exist`);
    expect(resp.body.error.status).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found");
  });
});


/** PATCH /items/:name: - take json with item info. return updated info:
 * `{name, price}` */

describe("PATCH /items/:name", function() {
  it("Update an item successfully", async function() {
    const resp = await request(app)
      .patch(`/items/${item.name}`)
      .send({
        "name": "new_popsicle",
        "price": 3.00
      });
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      "updated": { "name": "new_popsicle", "price": 3.00 }
    });
  });

  it("Update an item that doesn't exist", async function() {
    const resp = await request(app)
      .patch(`/items/doesnt_exist`)
      .send({
        "name": "new_popsicle",
        "price": 3.00
      });
    expect(resp.body.error.status).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found");
  });
});


/** DELETE /items/:name: - delete item. return `{message: "Deleted"}` */

describe("DELETE /items/:name", function() {
  it("Delete an item successfully", async function() {
    const resp = await request(app)
      .delete(`/items/${item.name}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({message: "Deleted"});
  });

  it("Delete an item that doesn't exist", async function() {
    const resp = await request(app)
      .post(`/items/doesnt_exist`);
    expect(resp.body.error.status).toEqual(404);
    expect(resp.body.error.message).toEqual("Not Found");
  });
});
