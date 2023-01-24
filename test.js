const path = require("path");
const fs = require("fs");

const testFilesPath = path.join(__dirname, "test");



fs.readdir(testFilesPath, function (err, files) {
    for (const file of files) {
        const filePath = path.join(testFilesPath, file)
        try {
            require(filePath)
        } catch (err) {
            console.log(err)
        }
        // eval(fs.readFileSync(filePath, {encoding: "utf8"}))
    }
})

