const file = require("../tools/file")
const assert = require("assert");
const path = require("path");

const filePath = path.join(__dirname, "../", "tools", "file.js");
const fileMd5Sum = '1c064ac1fd47386290e345d9ebe37f54';


file.md5File(filePath)
    .then(md5FileString => {
        assert.equal(md5FileString, fileMd5Sum)
    })
