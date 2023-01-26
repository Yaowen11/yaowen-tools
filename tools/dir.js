const fs = require('fs');
const path = require('path');

/**
 * 列出文件夹下所有文件
 * @param folderPath 文件夹路径
 * @returns {Promise<*[]>}
 */
async function walk(folderPath) {
    const files = [];
    await doWalk(folderPath, files);
    return files;
}

async function doWalk(folder, files) {
    const folderFiles = await fs.promises.readdir(folder);
    for (const file of folderFiles) {
        const filePath = path.join(folder, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isFile()) {
            files.push(filePath);
        }
        if (stat.isDirectory()) {
            await doWalk(filePath, files);
        }
    }
    return files;
}
async function folderContainsEmptyDirs(folder, emptyDirs) {
    const folderStat = await fs.promises.stat(folder);
    if (folderStat.isDirectory()) {
        const folderFiles = await fs.promises.readdir(folder);
        for (const folderFile of folderFiles) {
            const folderFilePath = path.join(folder, folderFile);
            const folderFileStat = await fs.promises.stat(folderFilePath);
            if (folderFileStat.isDirectory()) {
                const folderFileContainsFiles = await fs.promises.readdir(folderFilePath);
                if (folderFileContainsFiles.length === 0) {
                    emptyDirs.push(folderFilePath);
                } else {
                    await folderContainsEmptyDirs(folderFilePath, emptyDirs)
                }
            }
        }
    }
    return emptyDirs;
}

async function folderEmptyDirs(folder) {
    const folderEmptyDirs = [];
    await folderContainsEmptyDirs(folder, folderEmptyDirs)
    return folderEmptyDirs
}

async function recursiveDeleteEmptyDir(folder, basePath) {
    await fs.promises.rmdir(folder);
    const folderDir = path.dirname(folder);
    if (folderDir !== basePath) {
        await recursiveDeleteEmptyDir(folderDir, basePath);
    }
}

/**
 * 递归删除文件夹下空目录,包括其自身
 * @param folder 文件夹路径
 * @returns {Promise<void>}
 */
async function recursiveDeleteFolderEmptyDir(folder) {
    const folderStat = await fs.promises.stat(folder);
    if (folderStat.isDirectory()) {
        const emptyDirs = await folderEmptyDirs(folder);
        for (const emptyFolder of emptyDirs) {
            await recursiveDeleteEmptyDir(emptyFolder, folder);
        }
    }
}

exports.walk = walk;
exports.recursiveDeleteFolderEmptyDir = recursiveDeleteFolderEmptyDir;
