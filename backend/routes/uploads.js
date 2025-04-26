const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")
const path = require("path")
const fs = require("fs")
const config = require("../config/config")

// @route   POST api/uploads
// @desc    Upload files
// @access  Private
router.post("/", auth, upload.array("files", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Dosya yüklenmedi" })
    }

    const uploadedFiles = req.files.map((file) => ({
      name: file.originalname,
      path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
      size: file.size,
      mimetype: file.mimetype,
    }))

    res.json(uploadedFiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   DELETE api/uploads/:filename
// @desc    Delete a file
// @access  Private
router.delete("/:filename", auth, async (req, res) => {
  try {
    const userId = req.user.id
    const filename = req.params.filename
    const filePath = path.join(config.uploadDir, userId, filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Dosya bulunamadı" })
    }

    // Delete file
    fs.unlinkSync(filePath)

    res.json({ message: "Dosya silindi" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

module.exports = router
