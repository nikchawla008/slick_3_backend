const _ = require("lodash")
const fs = require("fs");

/**
 *
 * @param base64String {string}
 * @param outputPath
 * @return {Promise<unknown>}
 */
function base64ToFile2(base64String, outputPath) {

    const s = base64String.replace('data:audio/wav;base64,', '')
    const binaryString = Buffer.from(s, 'base64').toString('binary');

    return new Promise(resolve => {
        fs.writeFile(outputPath, binaryString, 'binary', (err) => {
            if (err) {
                resolve('')
            } else {
                resolve(outputPath)
            }
        });
    })
}

function deleteFile(filePath) {
    return new Promise(resolve => {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                // console.log('File deleted successfully:', filePath);
                resolve({})
            }
        });
    })
}


module.exports = {
    base64ToFile2,
    generateRandomFileName: (name) => {
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 8); // Adjust the length of the random string as needed
        const randomFileName = `${name}_${timestamp}_${randomString}`;
        return randomFileName;
    },
    deleteFile,

    option5Values: ({q4a, q5}) => {
        const q5Map = {
            '7-6': 'A2',
            '7-7': 'A2',

            '8-5': 'A2',
            '8-6': 'A2',
            '8-7': 'A2',

            '9-7': 'A2',
        }

        let q5Value;
        if(q4a < 9) {
            q5Value = 'A2'
        } else {

            if([6,7].includes(q5)) {
                q5Value = 'A1'
            } else {
                q5Value = 'A2'
            }
        }

        const arr = ['A1', 'A2']
        const q5Code = arr.indexOf(q5Value)

        return {q5Value, q5Code}

    },
    option12aValue: (request) => {
        const setOfValues = new Set([request.q11, ...request.q12])
        return [...setOfValues]
    }

}
