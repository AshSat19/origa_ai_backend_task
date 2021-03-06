const express = require('express');

const userControllers = require('../controllers/user.controllers');

const router = express.Router();

router.post(
    '/add-user', 
    userControllers.addUser
);

module.exports = router;
