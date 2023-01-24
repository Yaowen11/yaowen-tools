const fs = require("fs");
const crypto = require("crypto");

async function md5File(file) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(file);
        const md5Hash = crypto.createHash('md5');
        stream.on('error', (err) => {
            reject(err);
        })
        md5Hash.once('readable', () => {
            resolve(md5Hash.read().toString('hex'))
        })
        stream.pipe(md5Hash)
    })
}

exports.md5File = md5File
