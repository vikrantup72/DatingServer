import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const router = express.Router();

const imageSchema = new mongoose.Schema({
	name: String,
	path: String,
});

const Image = mongoose.model("Image", imageSchema);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
	try {
		// Save image information to MongoDB
		const newImage = new Image({
			name: req.body.name,
			path: req.file.path,
		});

		await newImage.save();

		return res.status(200).json("File uploaded successfully");
	} catch (error) {
		console.error(error);
		return res.status(500).json("Internal Server Error");
	}
});

export default router;
