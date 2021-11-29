const express = require('express');
const router = express.Router();
const userControllers = require('./../controllers/userControllers')


router.route('/')
.get(userControllers.getAllUsers)
.post(userControllers.addUser);


router.route('/:id')
.get(userControllers.getUser)
.patch(userControllers.editUser)
.delete(userControllers.deleteUser);

module.exports = router;