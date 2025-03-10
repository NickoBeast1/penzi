const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getSingleUSer,updateUser, deleteUser} = require('../controllers/usersController');


router.post('/users', createUser);
router.get('/users', getAllUsers );
router.get('/users/:user_id', getSingleUSer);
router.put('/users/:user_id', updateUser);
router.delete('/users/:user_id', deleteUser)

module.exports = router;