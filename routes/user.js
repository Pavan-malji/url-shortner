const express = require('express');
const router = express.Router();
const {handleUserSignup} = require('../controllers/user');
const {handleUserLogin} = require('../controllers/user');

router.post('/', handleUserSignup);
router.post('/login',handleUserLogin);

module.exports=router;