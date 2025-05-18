import { LocalFileStorage } from "@mjackson/file-storage/local";
import * as fs from "node:fs/promises";
import path from "node:path";
import { v7 } from "uuid";

const TEMP_DIR = path.join(process.cwd(), "storage/tmp");
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

export const storage = new LocalFileStorage(UPLOAD_DIR);

export const uploadService = {
  async saveTemp(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const fileName = v7() + file.name;

    // Ensure directory exists
    await fs.mkdir(TEMP_DIR, { recursive: true });

    const filePath = path.join(TEMP_DIR, fileName);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));
    return fileName;
  },

  async storeFile(file: string, folder: string = "") {
    try {
      const source = path.join(TEMP_DIR, file);
      const destination = path.join(UPLOAD_DIR, folder, file);

      await fs.access(source);

      // Ensure directory exists
      await fs.mkdir(path.join(UPLOAD_DIR, folder), { recursive: true });

      await fs.rename(source, destination);
      return path.join(folder, file);
    } catch (err) {
      console.error("Error moving file:", err);
      return file;
    }
  },

  async deleteFile(filePath: string) {
    const sourcePath = path.join(UPLOAD_DIR, filePath);
    fs.unlink(sourcePath).catch((err) => {
      console.log("File does not exist");
    });
  },
};
