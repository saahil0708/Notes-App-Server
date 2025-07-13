import express from 'express';
import { registerUser, loginUser, logoutUser, getUsers, getUserById, updateUser, deleteUser } from '../Controllers/User.Controller.js';
import userAuth from '../Middleware/UserAuth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/', userAuth, getUsers);
router.get('/:id', userAuth, getUserById);
router.put('/:id', userAuth, updateUser);
router.delete('/:id', userAuth, deleteUser);

export default router;