const fs = require('fs');
const { resolve } = require('path');

function writeDataToFile(filename, content){
    fs.writeFileSync(filename, JSON.stringify(content), 'utf8', (err) =>{
        if (err) {
            console.log(err);
        }
    })
}

function getPostData(req) {
    return new Promise((resolve, reject)=> {
     try {
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        })
        req.on('end', () => {
            resolve(body)

        })
     } catch (error) {
        reject(err)

     }
    })
}


module.exports = {
    writeDataToFile,
    getPostData
}