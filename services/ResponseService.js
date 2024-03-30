const responseCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    SUCCESS: 200,
    CREATED: 201,

}

const errorMessages = {
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
    BAD_GATEWAY: 'Bad Gateway',
    SERVICE_UNAVAILABLE: 'Service Unavailable',
    USER_EXISTS: 'User already exists',
    PASSWORD_MISMATCH: 'Password mismatch',
    LOGIN_FAILURE: 'Username does not exist',
    LOGOUT_FAILURE: 'Logout failed',
    AUTHENTICATE_FAILURE: 'Authentication failed',
}

const successMessages = {
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login Successful',
    LOGOUT_SUCCESS: 'Logout Successful',
    AUTHENTICATE_SUCCESS: 'Authentication Successful',

    SURVEY_SUBMITTED: "Survey Submitted",
}

module.exports = {
    responseCodes: responseCodes,
    errorMessages: errorMessages,
    successMessages: successMessages
}
