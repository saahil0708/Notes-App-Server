import NotesModel from "../Models/Notes.Model.js";

export const createNote = async (req, res) => {
    const { title, content, tags } = req.body;
    if(!title || !content) return res.status(400).json({ message: "Title and content are required" });

    try {
        const newNote = new NotesModel({ title, content, tags, user: req.user.id });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    } catch (error) {
        res.status(500).json({ message: "Failed to create note", error: error.message });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await NotesModel.find({ user: req.user.id });
        res.status(200).json({ notes });
    } catch (error) {
        res.status(500).json({ message: "Failed to get notes", error: error.message });
    }
};

export const getNotesById = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: "Note ID is required" });

    try {
        const note = await NotesModel.findById(id);
        if(!note) return res.status(404).json({ message: "Note not found" });

        res.status(200).json({ note });
    } catch (error) {
        res.status(500).json({ message: "Failed to get notes", error: error.message });
    }
};

export const updateNote = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: "Note ID is required" });

    const { title, content, tags } = req.body;
    if(!title || !content) return res.status(400).json({ message: "Title and content are required" });

    try {
        const updatedNote = await NotesModel.findByIdAndUpdate(
            id,
            { title, content, tags },
            { new: true }
        );
        res.status(200).json({ message: "Note updated successfully", note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: "Failed to update note", error: error.message });
    }
};

export const deleteNote = async (req, res) => {
    const { id } = req.params;
    if(!id) return res.status(400).json({ message: "Note ID is required" });

    try {
        await NotesModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note", error: error.message });
    }
};