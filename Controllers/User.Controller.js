import UserModel from "../Models/User.Model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "All fields are required" });

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(409).json({ message: "Email already in use" });
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, username, email } });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ message: "Login successful", token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Failed to login", error: error.message });
    }
};

export const getUsers = async (req, res) => {
    const users = await UserModel.find();

    try {
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    try {
        const user = await UserModel.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Failed to get user", error: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });
    try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    return res.status(200).json({ message: "User logged out successfully" });
};