#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { ContextBuilder } from './builder.js';
import { ContextBuilderOptions } from './types.js';
import packageJson from '../package.json' with { type: 'json' };

// Register the CLI program
program
  .name('context-builder')
  .description('Build a comprehensive context file from JavaScript/TypeScript projects for LLMs')
  .version(packageJson.version);

// Add main command
program
  .argument('<directory>', 'Directory to process (defaults to current directory)')
  .option('-o, --output <file>', 'Output file path', 'context.md')
  .option('-i, --include <patterns...>', 'Glob patterns for files to include')
  .option('-e, --exclude <patterns...>', 'Glob patterns for files to exclude')
  .option('--no-imports', 'Do not follow imports')
  .option('--no-comments', 'Do not include comments')
  .option('--max-depth <depth>', 'Maximum depth for import traversal', '3')
  .option('--no-file-structure', 'Do not include file structure information')
  .action(async (directory, options) => {
    // Normalize directory path
    const dir = path.resolve(directory || '.');
    
    // Parse options
    const builderOptions: ContextBuilderOptions = {
      directory: dir,
      outputFile: path.resolve(options.output),
      followImports: options.imports !== false,
      includeComments: options.comments !== false,
      includeFileStructure: options.fileStructure !== false,
      maxImportDepth: parseInt(options.maxDepth, 10),
    };
    
    if (options.include) {
      builderOptions.include = options.include;
    }
    
    if (options.exclude) {
      builderOptions.exclude = options.exclude;
    }
    
    try {
      // Run the builder
      const builder = new ContextBuilder(builderOptions);
      await builder.build();
    } catch (error) {
      console.error('Error building context:', error);
      process.exit(1);
    }
  });

// Parse arguments
program.parse(); 