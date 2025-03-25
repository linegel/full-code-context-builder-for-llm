/**
 * Configuration options for the context builder
 */
export interface ContextBuilderOptions {
  /**
   * The directory to scan for files
   */
  directory: string;
  
  /**
   * Output file path
   */
  outputFile: string;
  
  /**
   * Glob patterns for files to include
   */
  include?: string[];
  
  /**
   * Glob patterns for files to exclude
   */
  exclude?: string[];
  
  /**
   * Whether to follow imports and add them to the context
   */
  followImports?: boolean;
  
  /**
   * Whether to include comments in the output
   */
  includeComments?: boolean;
  
  /**
   * Maximum depth for import traversal
   */
  maxImportDepth?: number;
  
  /**
   * Whether to add file structure information
   */
  includeFileStructure?: boolean;
}

/**
 * Parsed file information
 */
export interface ParsedFile {
  /**
   * File path
   */
  path: string;
  
  /**
   * File content
   */
  content: string;
  
  /**
   * Imported files (paths)
   */
  imports: string[];
} 