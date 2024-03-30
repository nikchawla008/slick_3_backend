const {Storage} = require("@google-cloud/storage");

// Replace with your GCS bucket name
const bucketName = 'festive-magpie-416205.appspot.com';

const storage = new Storage({keyFilename: "Gkey.json"});

module.exports = {

    /**
     * Upload file from path to gcp
     * @param bufferData File Data
     * @param filePath File name
     * @return {Promise<string>} File Link
     */
    uploadFileFromPath: async (bufferData, filePath) => {
        try {
            const result = await storage.bucket(bucketName).upload(bufferData, {
                metadata: {cacheControl: 'public'},
                destination: `/OCT/${filePath}`
            });

            return result[1].mediaLink

        } catch (exception) {
            throw exception
        }
    }
}
