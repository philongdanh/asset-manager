import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
    private readonly uploadDir = 'uploads';

    constructor() {
        this.ensureUploadDirExists();
    }

    private ensureUploadDirExists() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(this.uploadDir, fileName);

        await fs.promises.writeFile(filePath, file.buffer);

        // Return the relative path or a full URL depending on how we serve it.
        // For now, returning the relative path which can be served via static file serving.
        return `/uploads/${fileName}`;
    }
}
