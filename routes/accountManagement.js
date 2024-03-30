const express = require('express');
const router = express.Router();

const Joi = require('joi');
const BcryptService = require('../services/BcryptService');
const jwt = require('jsonwebtoken');

const ResponseService = require('../services/ResponseService');

const UserService = require('../services/UserService');

/**
 * [POST] API to create a new account
 */
router.post('/createAccount', (req, res) => {

    try {

        console.log('*********************** ROUTE: POST /accountManagement/createAccount **********************************')

        let request = {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email.toLowerCase(),
            isSuperAdmin: req.body.isSuperAdmin
        }

        console.log('REQUEST BODY: ', request);


        let schema = Joi.object().keys({
            name: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            isSuperAdmin: Joi.boolean().required()
        });

        let result = schema.validate(request);

        if (result.error) {
            return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                message: result.error.details[0].message
            });
        } else {
            //check if user exists
            //if user exists, return error
            //if user does not exist, create user
            requestInfo = {
                email: request.email.toLowerCase()
            }
            UserService.findUserByEmail(requestInfo).then(async (user) => {
                console.log(user)
                if (user) {
                    return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                        message: ResponseService.errorMessages.USER_EXISTS
                    });
                } else {
                    request.password = await BcryptService.encryptedPassword(request.password);


                    UserService.createNewAccount(request).then(user => {
                        return res.status(ResponseService.responseCodes.CREATED).send({
                            message: ResponseService.successMessages.USER_CREATED,
                            account: {
                                name: user.name,
                                email: user.email,
                                isSuperAdmin: user.isSuperAdmin,
                                token: user.token
                            }
                        });
                    })
                        .catch(err => {
                            return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
                                message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR,
                            });
                        });
                }
            })
                .catch(err => {
                    return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
                        message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR,
                    });
                });
        }

    } catch (err) {
        console.log(err.message);
        return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
            message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR,
        });
    }
});


/**
 * [POST] API to Log in to an account
 */
router.post('/login', (req, res) => {

    try {

        console.log('*********************** ROUTE: POST /accountManagement/login **********************************')

        let request = {
            email: req.body.email,
            password: req.body.password
        }

        console.log('REQUEST BODY: ', request);

        let schema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        let result = schema.validate(request);

        if (result.error) {
            return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                message: result.error.details[0].message
            });
        } else {
            //Find user with specified email
            let requestInfo = {
                email: request.email
            }
            UserService.findUserByEmail(requestInfo).then(async (user) => {
                if (user) {
                    //Check if password matches
                    let passwordMatch = await BcryptService.isSamePassword(request.password, user.password);
                    if (passwordMatch) {

                        // Create token
                        const token = jwt.sign({
                                name: user.name,
                                email: user.email
                            },
                            process.env.JWT_SECRET,
                            {
                                expiresIn: '672h'
                            });

                        // save user token

                        //update info of user with token
                        let updateInfo = {
                            email: user.email,
                            token: token
                        }

                        //internal server error if unable to update user token
                        UserService.updateUserToken(updateInfo).then(user => {
                        }).catch(err => {
                            return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({message: ResponseService.errorMessages.INTERNAL_SERVER_ERROR})
                        });

                        return res.status(ResponseService.responseCodes.SUCCESS).send({
                            message: ResponseService.successMessages.LOGIN_SUCCESS,
                            account: {
                                name: user.name,
                                email: user.email,
                                isSuperAdmin: user.isSuperAdmin,
                                token: token
                            }
                        });
                    } else {
                        return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                            message: ResponseService.errorMessages.PASSWORD_MISMATCH
                        });
                    }
                } else {
                    return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                        message: ResponseService.errorMessages.LOGIN_FAILURE
                    });
                }
            })
        }


    } catch (err) {
        console.log(err.message);
        return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
            message: err.message,
        });
    }

});

/**
 * POST API to authenticate jwt token
 */
router.post('/authenticate', (req, res) => {
    console.log('*********************** ROUTE: POST /accountManagement/authenticate **********************************')
    try {
        console.log('REQUEST AUTHORIZATION TOKEN: ', req.headers.authorization);

        let token = req.headers.authorization.split(' ')[1];

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
                UserService.findUserByEmail(account).then(user => {
                    if (user) {
                        return res.status(ResponseService.responseCodes.SUCCESS).send({
                            message: ResponseService.successMessages.AUTHENTICATE_SUCCESS,
                            account: {
                                name: user.name,
                                email: user.email,
                                isSuperAdmin: user.isSuperAdmin,
                                token: user.token
                            }
                        });
                    } else {
                        return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                            message: ResponseService.errorMessages.AUTHENTICATE_FAILURE
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
});

/**
 * [POST] API to log a user out
 */
router.post('/logout', (req, res) => {

    try {
        console.log('*********************** ROUTE: POST /accountManagement/logout **********************************')

        let request = {
            email: req.body.email
        }

        console.log('REQUEST BODY: ', request);

        let schema = Joi.object().keys({
            email: Joi.string().email().required()
        });

        let result = schema.validate(request);

        if (result.error) {
            return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                message: result.error.details[0].message
            });
        } else {
            //Find user with specified email
            let requestInfo = {
                email: request.email.toLowerCase()
            }
            UserService.findUserByEmail(requestInfo).then((user) => {
                if (user) {
                    return res.status(ResponseService.responseCodes.SUCCESS).send({
                        message: ResponseService.successMessages.LOGOUT_SUCCESS
                    });
                } else {
                    return res.status(ResponseService.responseCodes.BAD_REQUEST).send({
                        message: ResponseService.errorMessages.LOGOUT_FAILURE
                    });
                }
            })
        }


    } catch (err) {
        console.log(err.message);
        return res.status(ResponseService.responseCodes.INTERNAL_SERVER_ERROR).json({
            message: ResponseService.errorMessages.LOGOUT_FAILURE,
        });
    }

});


module.exports = router;
