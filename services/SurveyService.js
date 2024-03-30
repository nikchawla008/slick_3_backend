const Survey = require('../models/survey');


module.exports = {
    createNewSurvey: (information) => {

        return new Promise((resolve, reject) => {
            let newSurvey = new Survey(information);
            newSurvey.save().then(survey => resolve(survey)).catch(err => {
                reject(err)
            });
        });
    },

    /**
     * Fetches all survey records
     * @return {Promise<Array>}
     */
    fetchAllData: () => {
        return Survey.find({}).exec().then(survey => survey.map((eachSurvey => eachSurvey['_doc'])));
    },

    updateSurvey: (where, update) => {
        return Survey.updateOne(where, update).exec().then((a) => {
            console.log(a)
        })
    }


}
