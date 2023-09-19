const express = require('express');

const signUpHandler = require('./requests/signUp');
const activateHandler = require('./requests/activate');
const signInHandler = require('./requests/signIn');
const signOutHandler = require('./requests/signOut');
const refreshHandler = require('./requests/refresh');
const signUpValidate = require('./validations/signUp');
const activateValidate = require('./validations/activate');
const signOutValidate = require('./validations/signOut');

const apiRouter = express.Router();

apiRouter.post('/user', signUpValidate, signUpHandler);
apiRouter.get('/user/activate/:link', activateValidate, activateHandler);
apiRouter.post('/auth', signInHandler);
apiRouter.delete('/auth', signOutValidate, signOutHandler);
apiRouter.put('/auth', refreshHandler);

module.exports = apiRouter;