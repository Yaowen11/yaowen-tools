const path = require("path");
const fs = require("fs");

const testFilesPath = path.join(__dirname, "test");

fs.readdir(testFilesPath, async function (err, files) {
    for (const file of files) {
        const filePath = path.join(testFilesPath, file)
        try {
            const fileStat = await fs.promises.stat(filePath);
            if (fileStat.isFile() && file.endsWith('.js')) {
                require(filePath)
            }
        } catch (err) {
            console.log(err)
        }
    }
})

