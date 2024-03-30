const mongoose = require('mongoose');
const Schema = mongoose.Schema

const surveySchema = new mongoose.Schema({
    name: { type: Schema.Types.Mixed, default: '', required: false },
    contactNumber: { type: Schema.Types.Mixed, default: '', required: false },

    surveyorName: { type: Schema.Types.Mixed, required: false, default: '' },
    date: { type: Schema.Types.Mixed, required: false, default: '' },
    place: { type: Schema.Types.Mixed, default: '', required: false },


    q1: { type: Schema.Types.Mixed, default: null, required: false },

    q2: { type: Schema.Types.Mixed, required: false },

    q3: { type: Schema.Types.Mixed, required: false },

    q4: { type: Schema.Types.Mixed, required: false },

    q4a: { type: Schema.Types.Mixed, required: false, default: 0 },

    q5: { type: Schema.Types.Mixed, required: false },
    q5a: { type: Schema.Types.Mixed, required: false },
    q5b: { type: Schema.Types.Mixed, required: false },

    q6: { type: Schema.Types.Mixed, required: false },

    q7: { type: Schema.Types.Mixed, required: false },
    q7a: { type: Schema.Types.Mixed, required: false },

    q8: { type: Schema.Types.Mixed, required: false},

    q9: { type: Schema.Types.Mixed, required: false },

    q10: { type: Schema.Types.Mixed, required: false },

    q11: { type: Schema.Types.Mixed, required: false },

    q12: { type: Schema.Types.Mixed, required: false },

    q13: { type: Schema.Types.Mixed, required: false },

    q14: { type: Schema.Types.Mixed, required: false },

    q15: { type: Schema.Types.Mixed, required: false },

    q16: { type: Schema.Types.Mixed, required: false },


    interviewDateStart: { type: Schema.Types.Mixed, required: false, default: '' },

    latitude: { type: Schema.Types.Mixed, default: 0, required: false },
    longitude: { type: Schema.Types.Mixed, default: 0, required: false },

    interviewer: { type: String, required: false, default: '' },
    interviewDate: { type: Schema.Types.Mixed, required: false, default: '' },


})

module.exports = mongoose.model('Survey', surveySchema, "SLICK_Survey")
