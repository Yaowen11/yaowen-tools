const dir = require("../tools/dir.js");

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const filesPath = path.join(__dirname, "tmpFiles");
const emptyDirs = path.join(__dirname, "emptyDirs");

async function testDirWalk() {
    const dirFiles = await fs.promises.readdir(emptyDirs)
    assert.ok(
        dirFiles.length > 0,
        "Directory walk failed"
    )
}

async function testRmEmptyDir(dirPath) {
    await dir.rmFolderEmptyDir(dirPath);
    assert.ok(fs.existsSync(dirPath), "cannot delete directory")
}

async function prepareFiles() {
    if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath);
    }
    const tempFiles = ["1.txt", "2.txt", "3.txt"]
    for (const file of tempFiles) {
        const filePath = path.join(filesPath, file)
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, file)
        }
    }
    return Promise.resolve(filesPath);
}

async function prepareEmptyDir() {
    if (!fs.existsSync(emptyDirs)) {
        fs.mkdirSync(emptyDirs);
    }
    for (const i of [1, 2, 3]) {
        const emptyDirPath = path.join(emptyDirs, i.toString());
        if (!fs.existsSync(emptyDirPath)) {
            fs.mkdirSync(emptyDirPath)
        }
    }
    return Promise.resolve(emptyDirs);
}

prepareFiles()
    .then(testDirWalk)
    .then(async () => {
        const exists = fs.existsSync(filesPath)
        if (exists) {
            await fs.promises.rm(filesPath, {recursive: true})
        }
    })
prepareEmptyDir()
    .then(testRmEmptyDir)
    .then(async () => {
        const exists = fs.existsSync(emptyDirs)
        if (exists) {
            await fs.promises.rm(emptyDirs, {recursive: true})
        }
    })

