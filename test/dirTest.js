const dir = require("../tools/dir.js");

const fs = require("fs");
const path = require("path");
const assert = require("assert");

const filesPath = path.join(__dirname, "tmpFiles");
const emptyDirs = path.join(__dirname, "emptyDirs");

async function testDirWalk(dirFiles) {
    const dirWalks = await dir.walk(filesPath)
    dirWalks.sort();
    dirFiles.sort();
    assert.ok(
        dirWalks.toString() === dirFiles.toString(),
        "Directory walk failed"
    )
}

async function testRecursiveDeleteFolderEmptyDir(rootFile) {
    await dir.recursiveDeleteFolderEmptyDir(emptyDirs);
    const emptyDirFiles = await fs.promises.readdir(emptyDirs);
    assert.ok(
        emptyDirFiles.length === 1 && path.join(emptyDirs, emptyDirFiles[0]) === rootFile
        , "cannot delete directory"
    )
}

async function prepareFiles() {
    if (!fs.existsSync(filesPath)) {
        fs.mkdirSync(filesPath);
    }
    const rootFile = path.join(filesPath, 'root.txt')
    if (!fs.existsSync(rootFile)) {
        fs.writeFileSync(rootFile, 'root', 'utf8');
    }
    const firstDirectory = path.join(filesPath, 'first')
    if (!fs.existsSync(firstDirectory)) {
        fs.mkdirSync(firstDirectory)
    }
    const firstDirectoryFile = path.join(firstDirectory, 'first.txt');
    if (!fs.existsSync(firstDirectoryFile)) {
        fs.writeFileSync(firstDirectoryFile, 'first', 'utf8')
    }
    const secondDirectory = path.join(firstDirectory, 'second');
    if (!fs.existsSync(secondDirectory)) {
        fs.mkdirSync(secondDirectory);
    }
    const secondDirectoryFile = path.join(secondDirectory, 'second.txt');
    if (!fs.existsSync(secondDirectoryFile)) {
        fs.writeFileSync(secondDirectoryFile, 'second', 'utf8')
    }
    return Promise.resolve([
        rootFile,
        firstDirectoryFile,
        secondDirectoryFile
    ]);
}

async function prepareEmptyDir() {
    if (!fs.existsSync(emptyDirs)) {
        fs.mkdirSync(emptyDirs);
    }
    const rootFile = path.join(emptyDirs, 'root.txt')
    if (!fs.existsSync(rootFile)) {
        fs.writeFileSync(rootFile, 'root', 'utf8');
    }
    const firstDirectory = path.join(emptyDirs, 'first');
    if (!fs.existsSync(firstDirectory)) {
        fs.mkdirSync(firstDirectory);
    }
    const secondDirectory = path.join(firstDirectory, 'second')
    if (!fs.existsSync(secondDirectory)) {
        fs.mkdirSync(secondDirectory);
    }
    return Promise.resolve(rootFile);
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
    .then(testRecursiveDeleteFolderEmptyDir)
    .then(async () => {
        const exists = fs.existsSync(emptyDirs)
        if (exists) {
            await fs.promises.rm(emptyDirs, {recursive: true})
        }
    })

