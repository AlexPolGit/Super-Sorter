import * as fs from 'fs';
import * as path from 'path';
import { InternalServerException } from '../domain/exceptions/base.js';

export function saveStringToFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    fs.mkdir(dir, { recursive: true }, (error) => {
        if (error) {
            throw new InternalServerException(`Error creating directory: ${error}`);
        }

        fs.writeFile(filePath, content, (error) => {
            if (error) {
                throw new InternalServerException(`Error writing to file: ${error}`);
            } 
            else {
                console.log(`Successfully wrote to file: "${filePath}".`);
            }
        });
    });
}

export function readJsonFile<T>(filePath: string) {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return JSON.parse(data) as T;
    }
    catch (error) {
        throw new InternalServerException(`Error reading file: ${error}`);
    }
}
