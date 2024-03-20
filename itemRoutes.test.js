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



// TEST ADD ITEM

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

// TEST GET SINGLE ITEM

// TEST UPDATE ITEM

// TEST DELETE ITEM