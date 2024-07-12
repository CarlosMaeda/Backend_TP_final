const express = require("express");

const { ping } = require("./test.repository");

const testRouter = express.Router();

testRouter.get("/test", ping);

module.exports = { testRouter };
