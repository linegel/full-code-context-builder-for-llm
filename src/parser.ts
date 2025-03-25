import path from 'path';
import parseImportsLib from 'parse-imports';
import { resolveImportPath, setParseImportsFunc } from './scanner.js';

/**
 * Regular expressions for different import syntaxes
 */
const IMPORT_PATTERNS = [
  // ES6 imports
  /import\s+(?:[\w*\s{},]*)\s+from\s+['"]([^'"]+)['"]/g,
  // ES6 dynamic imports
  /import\(['"]([^'"]+)['"]\)/g,
  // CommonJS require
  /require\(['"]([^'"]+)['"]\)/g,
];

/**
 * Parse imports from a file
 */
export async function parseImports(filePath: string, content: string): Promise<string[]> {
  const imports: Set<string> = new Set();
  
  // Use parse-imports for ES6 import syntax
  try {
    const moduleImports = await parseImportsLib(content);
    
    for (const moduleImport of moduleImports) {
      const importPath = moduleImport.moduleSpecifier.value;
      if (importPath && typeof importPath === 'string') {
        const resolved = resolveImportPath(importPath, filePath);
        if (resolved) {
          imports.add(resolved);
        }
      }
    }
  } catch (error) {
    console.warn(`Error parsing ES6 imports in ${filePath}:`, error);
  }
  
  // Fallback to regex for simpler cases or when the library fails
  for (const pattern of IMPORT_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        const importPath = match[1];
        const resolved = resolveImportPath(importPath, filePath);
        if (resolved) {
          imports.add(resolved);
        }
      }
    }
  }
  
  return Array.from(imports);
}

// Register the parse imports function with the scanner
setParseImportsFunc(parseImports); 