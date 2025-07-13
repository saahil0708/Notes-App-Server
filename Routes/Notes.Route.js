import express from 'express';
import { createNote, getNotes, getNotesById, deleteNote, updateNote } from '../Controllers/Notes.Controller.js';
import userAuth from '../Middleware/UserAuth.js';

const router = express.Router();

router.post('/', userAuth, createNote);
router.get('/', userAuth, getNotes);
router.get('/:id', userAuth, getNotesById);
router.put('/:id', userAuth, updateNote);
router.delete('/:id', userAuth, deleteNote);

export default router;