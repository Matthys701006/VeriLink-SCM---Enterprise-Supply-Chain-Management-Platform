#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function searchInFiles(directory, searchTerm) {
  const results = [];
  
  async function searchDirectory(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip node_modules and other common directories
          if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
            await searchDirectory(fullPath);
          }
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
          try {
            const content = await readFile(fullPath, 'utf-8');
            if (content.includes(searchTerm)) {
              results.push(fullPath);
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      }
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  await searchDirectory(directory);
  return results;
}

// Search for files containing "useSupabaseInit"
const searchTerm = process.argv[2] || 'useSupabaseInit';
const searchDir = process.argv[3] || 'src';

searchInFiles(searchDir, searchTerm)
  .then(results => {
    if (results.length > 0) {
      console.log('Files containing "' + searchTerm + '":');
      results.forEach(file => console.log(file));
    } else {
      console.log('No files found containing "' + searchTerm + '"');
    }
  })
  .catch(error => {
    console.error('Error searching files:', error.message);
  });