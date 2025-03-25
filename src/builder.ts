import fs from 'fs/promises';
import path from 'path';
import { ContextBuilderOptions, ParsedFile } from './types.js';
import { scanDirectory, readFile } from './scanner.js';

/**
 * Default options for the context builder
 */
export const DEFAULT_OPTIONS: Partial<ContextBuilderOptions> = {
  include: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
  exclude: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.git/**',
    '**/coverage/**',
    '**/*.test.*',
    '**/*.spec.*',
  ],
  followImports: true,
  includeComments: true,
  maxImportDepth: 3,
  includeFileStructure: true,
};

/**
 * Main class for building the context
 */
export class ContextBuilder {
  private options: ContextBuilderOptions;
  private visitedFiles: Set<string> = new Set();
  private allFiles: ParsedFile[] = [];
  
  constructor(options: ContextBuilderOptions) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    } as ContextBuilderOptions;
  }
  
  /**
   * Build the context and write to file
   */
  public async build(): Promise<void> {
    console.log(`Scanning directory: ${this.options.directory}`);
    
    const files = await scanDirectory(this.options);
    console.log(`Found ${files.length} files matching pattern`);
    
    await this.processFiles(files);
    
    await this.writeOutput();
    
    console.log(`Context built successfully to ${this.options.outputFile}`);
  }
  
  /**
   * Process the files and collect their content
   */
  private async processFiles(filePaths: string[], depth = 0): Promise<void> {
    if (depth > (this.options.maxImportDepth ?? 3)) {
      return;
    }
    
    const newImports: string[] = [];
    
    for (const filePath of filePaths) {
      if (this.visitedFiles.has(filePath)) {
        continue;
      }
      
      this.visitedFiles.add(filePath);
      
      const parsedFile = await readFile(filePath, this.options);
      this.allFiles.push(parsedFile);
      
      if (this.options.followImports && parsedFile.imports.length > 0) {
        newImports.push(...parsedFile.imports);
      }
    }
    
    if (newImports.length > 0) {
      // Remove duplicates
      const uniqueImports = Array.from(new Set(newImports));
      await this.processFiles(uniqueImports, depth + 1);
    }
  }
  
  /**
   * Write the collected context to the output file
   */
  private async writeOutput(): Promise<void> {
    let output = '';
    
    // Add file structure information if requested
    if (this.options.includeFileStructure) {
      output += '## Project File Structure\n\n';
      output += 'The following files have been included in this context:\n\n';
      
      for (const file of this.allFiles) {
        const relativePath = path.relative(this.options.directory, file.path);
        output += `- ${relativePath}\n`;
      }
      
      output += '\n---\n\n';
    }
    
    // Add file contents
    for (const file of this.allFiles) {
      const relativePath = path.relative(this.options.directory, file.path);
      const fileContent = this.options.includeComments === false 
        ? this.removeComments(file.content, path.extname(file.path))
        : file.content;
      
      output += `## File: ${relativePath}\n\n`;
      output += '```' + this.getLanguageFromExtension(file.path) + '\n';
      output += fileContent;
      output += '\n```\n\n';
      output += '---\n\n';
    }
    
    // Write to file
    await fs.writeFile(this.options.outputFile, output, 'utf-8');
  }
  
  /**
   * Remove comments from code based on file extension
   */
  private removeComments(content: string, fileExt: string): string {
    switch (fileExt.toLowerCase()) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        return this.removeJsComments(content);
      case '.py':
        return this.removePythonComments(content);
      case '.html':
      case '.xml':
        return this.removeHtmlComments(content);
      case '.css':
      case '.scss':
      case '.less':
        return this.removeCssComments(content);
      case '.md':
      case '.markdown':
        // Don't remove comments from markdown
        return content;
      default:
        // For unknown file types, use a generic approach
        return this.removeGenericComments(content);
    }
  }
  
  /**
   * Remove JavaScript/TypeScript comments
   */
  private removeJsComments(content: string): string {
    // Remove single-line comments
    let result = content.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Clean up empty lines
    result = result.replace(/^\s*[\r\n]/gm, '');
    
    return result;
  }
  
  /**
   * Remove Python comments
   */
  private removePythonComments(content: string): string {
    // Remove single-line comments
    let result = content.replace(/#.*$/gm, '');
    
    // Clean up empty lines
    result = result.replace(/^\s*[\r\n]/gm, '');
    
    return result;
  }
  
  /**
   * Remove HTML comments
   */
  private removeHtmlComments(content: string): string {
    // Remove HTML comments
    return content.replace(/<!--[\s\S]*?-->/g, '');
  }
  
  /**
   * Remove CSS comments
   */
  private removeCssComments(content: string): string {
    // Remove CSS comments
    return content.replace(/\/\*[\s\S]*?\*\//g, '');
  }
  
  /**
   * Generic comment removal for unknown file types
   */
  private removeGenericComments(content: string): string {
    // Try to remove common comment styles
    let result = content;
    
    // Remove C-style comments
    result = result.replace(/\/\/.*$/gm, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove shell/python style comments
    result = result.replace(/#.*$/gm, '');
    
    // Remove HTML comments
    result = result.replace(/<!--[\s\S]*?-->/g, '');
    
    // Clean up empty lines
    result = result.replace(/^\s*[\r\n]/gm, '');
    
    return result;
  }
  
  /**
   * Get the language for syntax highlighting from the file extension
   */
  private getLanguageFromExtension(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.js':
        return 'javascript';
      case '.jsx':
        return 'jsx';
      case '.ts':
        return 'typescript';
      case '.tsx':
        return 'tsx';
      case '.json':
        return 'json';
      case '.md':
        return 'markdown';
      case '.css':
        return 'css';
      case '.scss':
        return 'scss';
      case '.html':
        return 'html';
      default:
        return '';
    }
  }
} 