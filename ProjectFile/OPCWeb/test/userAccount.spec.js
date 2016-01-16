//profileController.spec.js

'use strict';

var expect = require("chai").expect;
var request = require("supertest");
var app = require("../bin/www.js").server;

describe("userAccount function test", function() {
    it("POST /register", function(done) {
        // request(app).post("")
    });

    it("POST /login", function(done) {
        request(app).post("/login")
            .send({
                "username": "testUser",
                "password": "pass1111",
            })
            .end(function(req, res) {
                console.log(res.status);
                console.log(res.body);
                expect(res).to.have.property("status", 302);
                done();
            });
    });
});
