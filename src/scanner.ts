import { glob } from 'glob';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ParsedFile, ContextBuilderOptions } from './types.js';

/**
 * Default file patterns to include
 */
const DEFAULT_INCLUDE = ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'];

/**
 * Default file patterns to exclude
 */
const DEFAULT_EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.git/**',
  '**/coverage/**',
  '**/*.test.*',
  '**/*.spec.*',
];

/**
 * Forward declaration for circular dependency
 */
let parseImportsFunc: (filePath: string, content: string) => Promise<string[]>;

export function setParseImportsFunc(func: (filePath: string, content: string) => Promise<string[]>) {
  parseImportsFunc = func;
}

/**
 * Scans a directory for files matching the given patterns
 */
export async function scanDirectory(options: ContextBuilderOptions): Promise<string[]> {
  const { directory, include = DEFAULT_INCLUDE, exclude = DEFAULT_EXCLUDE } = options;
  
  const files = await glob(include, {
    cwd: directory,
    ignore: exclude,
    absolute: true,
  });
  
  return files;
}

/**
 * Reads and parses a file
 */
export async function readFile(filePath: string, options: ContextBuilderOptions): Promise<ParsedFile> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    const imports = options.followImports && parseImportsFunc
      ? await parseImportsFunc(filePath, content) 
      : [];
    
    return {
      path: filePath,
      content,
      imports,
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return {
      path: filePath,
      content: `// Error reading file: ${(error as Error).message}`,
      imports: [],
    };
  }
}

/**
 * Resolves a relative import path to an absolute path
 */
export function resolveImportPath(importPath: string, fromFile: string): string {
  // Handle node_modules imports or absolute paths
  if (importPath.startsWith('@') || 
      !importPath.startsWith('.') ||
      importPath.startsWith('/')) {
    return '';
  }
  
  const baseDir = path.dirname(fromFile);
  const resolvedPath = path.resolve(baseDir, importPath);
  
  // Add extension if needed
  if (!path.extname(resolvedPath)) {
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
      const withExt = `${resolvedPath}${ext}`;
      try {
        // Check if file exists
        if (existsSync(withExt)) {
          return withExt;
        }
      } catch (_) {
        // File doesn't exist with this extension
      }
    }
    
    // Try index files
    for (const ext of ['.js', '.jsx', '.ts', '.tsx']) {
      const indexFile = path.join(resolvedPath, `index${ext}`);
      try {
        // Check if file exists
        if (existsSync(indexFile)) {
          return indexFile;
        }
      } catch (_) {
        // File doesn't exist
      }
    }
  }
  
  return resolvedPath;
} 