import { promises as fs } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of files in the correct order
const files = [
    'Enjine/core.js',
    'Enjine/gameCanvas.js',
    'Enjine/keyboardInput.js',
    'Enjine/resources.js',
    'Enjine/drawable.js',
    'Enjine/state.js',
    'Enjine/gameTimer.js',
    'Enjine/camera.js',
    'Enjine/drawableManager.js',
    'Enjine/sprite.js',
    'Enjine/spriteFont.js',
    'Enjine/frameSprite.js',
    'Enjine/animatedSprite.js',
    'Enjine/collideable.js',
    'Enjine/application.js'
];

// Base directory where the files are located
const baseDir = join(__dirname, 'src');

// Output file
const outputFile = 'copy.js';

// Function to combine files
async function combineFiles() {
    try {
        let combinedContent = '';
        
        for (const file of files) {
            const filePath = join(baseDir, file);
            console.log(`Reading file: ${filePath}`);
            
            try {
                const content = await fs.readFile(filePath, 'utf8');
                combinedContent += `// Source: ${file}\n${content}\n\n`;
            } catch (err) {
                console.error(`Error reading file ${file}:`, err);
            }
        }

        // Write the combined content to the output file
        await fs.writeFile(outputFile, combinedContent);
        console.log(`Successfully created ${outputFile}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

// Run the script
combineFiles();
