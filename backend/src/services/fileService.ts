import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  private uploadsDir: string;

  constructor(uploadsDir: string = 'uploads') {
    this.uploadsDir = uploadsDir;
  }

  /**
   * Process and save an image file
   * Converts JPG/PNG to WebP format with compression
   */
  async processAndSaveImage(
    file: Express.Multer.File,
    subDir: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<string> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 80,
    } = options;

    // Generate unique filename
    const filename = `${uuidv4()}.webp`;
    const dirPath = path.join(this.uploadsDir, subDir);
    const filePath = path.join(dirPath, filename);

    // Ensure directory exists
    await this.ensureDirectoryExists(dirPath);

    // Process image: resize, convert to WebP, and compress
    await sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toFile(filePath);

    // Return relative URL path
    return `/${this.uploadsDir}/${subDir}/${filename}`;
  }

  /**
   * Process and save multiple images
   */
  async processAndSaveMultipleImages(
    files: Express.Multer.File[],
    subDir: string,
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      const url = await this.processAndSaveImage(file, subDir, options);
      urls.push(url);
    }

    return urls;
  }

  /**
   * Delete a file
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Remove leading slash and construct full path
      const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      const filePath = path.join(process.cwd(), relativePath);

      // Check if file exists before deleting
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (error) {
      // File doesn't exist or couldn't be deleted
      console.error(`Failed to delete file ${fileUrl}:`, error);
    }
  }

  /**
   * Delete multiple files
   */
  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    for (const url of fileUrls) {
      await this.deleteFile(url);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get file size in bytes
   */
  async getFileSize(fileUrl: string): Promise<number> {
    try {
      const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      const filePath = path.join(process.cwd(), relativePath);
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get file size: ${error}`);
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    try {
      const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
      const filePath = path.join(process.cwd(), relativePath);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const fileService = new FileService();
