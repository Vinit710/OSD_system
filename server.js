const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);
const app = express();
const port = 3000;

// Set up file upload destination
const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(express.static('public'));

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    const outputImagePath = path.join(__dirname, 'uploads', 'output_image.jpg');

    const command = `node script.mjs ${filePath} ${outputImagePath}`;
    await execPromise(command);

    res.sendFile(outputImagePath);
  } catch (error) {
    res.status(500).send(`Error processing image: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
