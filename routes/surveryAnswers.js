const express = require('express');
const router = express.Router();

const ResponseService = require("../services/ResponseService");
const SurveyService = require("../services/SurveyService");

const DataProcessorService = require('../services/dataProcessorService')
const SurveyAnswerService = require('../services/SurveyAnswerService')
const _ = require('lodash')
const fs = require("fs");
const jwt = require("jsonwebtoken");
const UserService = require("../services/UserService");
const GCPService = require("../services/GCPService")


router.post('/submit', async (req, res) => {
    try {
        console.log('*********************** ROUTE: POST /submit/survey **********************************')
        const request = {
            ...req.body
        }

        if(!req.headers.authorization) {
            return res.status(ResponseService.responseCodes.UNAUTHORIZED).send({
                message: ResponseService.errorMessages.UNAUTHORIZED
            });
        }

        let token = req.headers.authorization.split(' ')[1];

        if(!token) {
            return res.status(ResponseService.responseCodes.UNAUTHORIZED).send({
                message: ResponseService.errorMessages.UNAUTHORIZED
            });
        }

        let account;

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(ResponseService.responseCodes.UNAUTHORIZED).send({
                    message: ResponseService.errorMessages.UNAUTHORIZED
                });
            } else {
                account = {
                    email: decoded.email
                }
                UserService.findUserByEmail(account).then(async (user) => {
                    if (user) {
                        request.interviewer = decoded.email;
                        request.interviewDate = new Date();



                        // STORE DERIVED DATA

                        // Q4A length
                        const q4a = request.q4.length

                        const {q5Value,q5Code} = DataProcessorService.option5Values(request)


                        // Q5a ==> CODE
                        const q5a = q5Code
                        const q5b = q5Value

                        // q7a
                        const q7a = 2


                        const newRequest = {
                            ...request,
                            q4a,
                            q5a,
                            q5b,
                            q7a,
                        }

                        const result = await SurveyService.createNewSurvey(newRequest)
                        return res.status(ResponseService.responseCodes.CREATED).json({message: ResponseService.successMessages.SURVEY_SUBMITTED})
                    } else {
                        return res.status(ResponseService.responseCodes.UNAUTHORIZED).send({
                            message: ResponseService.errorMessages.UNAUTHORIZED
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.log(err.message);
        return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
            message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR,
        });
    }
})

router.get('/fetch/all/data', async (req, res) => {

    try {
        console.log('*********************** ROUTE: GET /submit/fetch/all/data **********************************')
        let allSurveyData = await SurveyService.fetchAllData()
        console.log(allSurveyData)

        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Survey_Answers', {
            sheetFormat: {
                defaultColWidth: 55
            }
        });
        const headingColumnNames = SurveyAnswerService.questions.map(each => each.question)
        const keyNames = SurveyAnswerService.questions.map(each => each.key)


        //Write Heading in excel
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            let index = headingColumnIndex + 1
            ws.cell(1, index).string(heading)
            headingColumnIndex += 1
        });



        //Write Data in Excel file
        let rowIndex = 2;
        allSurveyData.forEach((record, index) => {
            let columnIndex = 2;
            record['id'] = record['_id'].toString()

            keyNames.forEach((each) => {
                const recordType = typeof record[each]
                // console.log(recordType, each)
                if(recordType === 'number') {
                    ws.cell(rowIndex, columnIndex).number(record[each])
                } else if (recordType === 'string') {
                    ws.cell(rowIndex, columnIndex).string(record[each] ? record[each] : '')
                } else if (recordType === 'object' && !!record[each]) {
                    let s = ''
                    if (Array.isArray(record[each])) {
                        s = record[each].join(', ')
                    } else {
                        if(record[each] instanceof Date) {
                            s = new Date(record[each]).toISOString()
                        } else {
                            s = record[each]
                        }
                    }
                    ws.cell(rowIndex, columnIndex).string(s ? s : '')
                } else {
                    // null
                    ws.cell(rowIndex, columnIndex).string('')
                }
                columnIndex += 1
            })
            rowIndex++;
        });



        wb.write('data.xlsx', (err, stats) => {
            fs.readFile('data.xlsx', (err, content) => {
                if (err) {
                    res.writeHead(404, {"content-type": "text/html"});
                    res.end("No such file!");
                } else {
                    res.writeHead(200, {"content-type": "application/xlsx"});
                    res.end(content);
                    // After the response has been sent, delete the file

                    DataProcessorService.deleteFile('data.xlsx')
                }
            });
        });
    } catch (err) {
        console.log(err)
        return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR})
    }

})


router.get('/backfill', async (req, res) => {
    res.status(200).json({message: "Done"})
})

module.exports = router
