import { Client, handle_file } from "@gradio/client";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [inputImagePath, outputImagePath] = process.argv.slice(2);

async function uploadImage() {
  try {
    const fileRef = handle_file(readFileSync(inputImagePath));

    console.log('Connecting to Gradio app...');
    const app = await Client.connect("shivam12119/fire");

    console.log('Making prediction...');
    const result = await app.predict("/predict", {
      image: fileRef,
    });

    console.log('Prediction result:', result);

    const imageUrl = result.data[0]?.url;
    if (!imageUrl) {
      throw new Error('Image URL not found in response.');
    }

    console.log('Fetching processed image from URL...');
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });

    writeFileSync(outputImagePath, response.data);

    console.log('Processed image saved as', outputImagePath);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack Trace:', error.stack);
  }
}

uploadImage();
