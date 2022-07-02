const express = require('express');
const router = express.Router();

const {login, register, todo_GetList, todo_AddUpdate, todo_GetSingle, todo_Delete} = require('../controllers/main');
const authMiddleware = require('../middleware/auth');

router.route('/login').post(login);
router.route('/register').post(register);
//router.route('/todos/:uname').get(todo_GetList);
router.route('/todos').get(authMiddleware, todo_GetList);
router.route('/todo').post(authMiddleware, todo_AddUpdate);
router.route('/todo/:id').post(authMiddleware, todo_GetSingle);
router.route('/todo').delete(authMiddleware, todo_Delete);




module.exports = router;