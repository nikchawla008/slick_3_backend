let User = require('../models/users');


createNewAccount = (information) => {

    return new Promise((resolve, reject) => {
        let newUser = new User(information);
        newUser.save().then(user => resolve(user)).catch(err => {
            reject(err)
        });
    });
}


//Find User from database by email
findUserByEmail = (information) => {

    let requestInformation = {
        email: information.email
    };



    return new Promise((resolve, reject) => {
        User.findOne(requestInformation).then(user => {
            resolve(user)
        }).catch(err => {
            reject(err)
        })
    });
}


//Add token to user information
updateUserToken = (information) => {
    let requestInformation = {
        email: information.email
    };

    return new Promise((resolve, reject) => {
        User.findOneAndUpdate(requestInformation, {token: information.token}).then(user => {
            resolve(user)
        }).catch(err => {
            reject(err)
        })
    });
}

findUserByToken = async (information) => {
    let requestInformation = {
        token: information.token
    };
    return User.findOne(information)
}


module.exports = {
    createNewAccount,
    findUserByEmail,
    updateUserToken,
    findUserByToken,
}
