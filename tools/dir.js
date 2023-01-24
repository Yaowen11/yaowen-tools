const fs = require('fs');
const path = require('path');

async function walk(folder, files) {
    const folderFiles = await fs.promises.readdir(folder);
    for (const file of folderFiles) {
        const filePath = path.join(folder, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
            files.push(filePath);
        }
        if (stat.isDirectory()) {
            await walk(filePath, files);
        }
    }
    return files;
}

async function folderIsEmptyDir(folder) {
    const folderStat = await fs.promises.stat(folder);
    if (folderStat.isDirectory()) {
        const folderFiles = await fs.promises.readdir(folder);
        return folderFiles.length === 0;
    }
    return false;
}
async function folderEmptyDirs(folder, emptyDirs) {
    const folderFiles = await fs.promises.readdir(folder);
    for (const folderFile of folderFiles) {
        const folderFilePath = path.join(folder, folderFile);
        const folderFileIsEmptyDir = await folderIsEmptyDir(folder);
        if (folderFileIsEmptyDir) {
            emptyDirs.push(folderFilePath);
        } else {
            await folderEmptyDirs(folderFilePath, emptyDirs)
        }
    }
    return emptyDirs;
}

async function recursiveDeleteEmptyDir(folder, basePath) {
    await fs.promises.rmdir(folder);
    const folderDir = path.dirname(folder);
    if (folderDir !== basePath) {
        await recursiveDeleteEmptyDir(folderDir, basePath);
    }
}

async function rmFolderEmptyDir(folder) {
    const folderStat = await fs.promises.stat(folder);
    if (folderStat.isDirectory()) {
        const emptyDirs = [];
        await folderEmptyDirs(folder, emptyDirs);
        for (const emptyFolder of emptyDirs) {
            await recursiveDeleteEmptyDir(emptyFolder, folder);
        }
    }
}

exports.walk = walk;
exports.rmFolderEmptyDir = rmFolderEmptyDir;
