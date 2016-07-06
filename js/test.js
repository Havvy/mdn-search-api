// const sinon = require("sinon");
const assert = require("better-assert");
// const equal = require("deep-eql");
const inspect = require("util").inspect;
const format = require("util").format;

const debug = false;
const logfn = debug ? console.log.bind(console) : function () {};

const fetch = require("node-fetch");

const {Builder, SearchResponse, responseIsValid} = require("./api");

describe("Builder", function () {
    it("works most basically with a query param", function () {
        const b = Builder();
        b.query("test");
        const url = b.build();
        logfn(url);
        assert(url === "https://developer.mozilla.org/en-US/search.json?q=test");
    });

    it("lets you add a topic", function () {
        const b = Builder();
        b.query("test");
        b.addTopic("js");
        const url = b.build();
        logfn(url);
        assert(url === "https://developer.mozilla.org/en-US/search.json?q=test&topic=js");
    });

    it("lets you add multiple topics", function () {
        const b = Builder();
        b.query("test");
        b.addTopic("js");
        b.addTopic("html");
        const url = b.build();
        logfn(url);
        assert(url === "https://developer.mozilla.org/en-US/search.json?q=test&topic=js&topic=html");
    });

    it("lets you chain", function () {
        const url = Builder().query("test").addTopic("js").addTopic("html").build();
        assert(url === "https://developer.mozilla.org/en-US/search.json?q=test&topic=js&topic=html");
    });
});

describe("responseIsValid", function () {
    it("a basic query request is valid", function () {
        const url = Builder().query("test").addTopic("js").addTopic("html").build();
        return fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (res) {
            assert(responseIsValid(res));
        });
    });
});