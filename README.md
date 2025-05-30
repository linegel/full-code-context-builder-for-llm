# LLM-Context-Builder

> ⚠️ **YOU MAY NOT NEED THIS**: Before looking deeper into the code, consider usage of following one-liner (tho tune it for your needs): `find . -not -path "*/node_modules/*" -not -path "*/\.*" -type f | grep -v "dist/" | grep -v "\.log$" | while read -r file; do echo -e "\n### FILE: $file ###\n" >> context.txt && cat "$file" >> context.txt; done`



> ⚠️ **WORK IN PROGRESS**: This project is currently in early development. Many features described are planned but not yet implemented.

A tool for developers who want to provide maximum context to Large Language Models (LLMs) without worrying about conservative token usage. By using your own API keys, you control how many tokens you send (up to the model's supported maximum), enabling the LLM to receive fuller context, reduce guesswork, and provide more accurate and context-aware code suggestions or fixes.

## Table of Contents
1. [Current Status](#current-status)
2. [Overview & Motivation](#overview--motivation)
3. [Vision](#vision)
4. [Current Implementation](#current-implementation)
5. [Roadmap](#roadmap)
6. [Contribution](#contribution)
7. [License](#license)

---

## Current Status

This project is currently in **early development**. At present:

- We are implementing the core functionality to scan directories and collect related files
- The project is being built with Node.js
- No stable release is available yet

---

## Overview & Motivation

### Frustration with Existing Tools

When working on complex projects, developers often need the LLM to have a comprehensive understanding of entire files, their imports, and the broader context of a codebase. Tools like Cursor and Windsurf are designed to help, but they can be surprisingly "token-shy."

- They may read files only 100 lines at a time.
- They slice the codebase into small chunks to avoid high usage costs.
- Their pricing model is often based on the number of requests, meaning they generally optimize for minimizing tokens per request.

However, many developers are more than willing to pay for larger token usage if it means the LLM truly understands the full context and can provide better solutions. It's frustrating to see partial context lead to incomplete or superficial answers, ultimately wasting time—as well as AI resources—because the LLM can't see the bigger picture.

**LLM-Context-Builder** aims to be the solution for developers who prefer to throw the entire necessary context at the LLM. By using your own API key, you'll control how large your prompt is (up to the LLM's token limit). If you want to exhaust the maximum allowable input tokens so you can feed entire files, entire sets of imports, or even your entire repository, that will be completely up to you.

---

## Current Implementation

LLM-Context-Builder now has a basic CLI implementation that allows you to:

1. Scan a directory for JavaScript and TypeScript files
2. Collect these files into a single context document
3. Optionally follow imports to include dependencies 
4. Output everything to a markdown file that's well-formatted for LLMs

### Installation

```bash
# Clone this repository
git clone https://github.com/YourUsername/LLM-Context-Builder.git
cd LLM-Context-Builder

# Install dependencies
npm install

# Build the project
npm run build

# Link it globally (optional)
npm link
```

### Usage

```bash
# Basic usage (scan current directory)
context-builder . -o context.md

# Specify include/exclude patterns
context-builder . -i "**/*.js" "**/*.ts" -e "**/node_modules/**" -o context.md

# Don't follow imports
context-builder . --no-imports

# Generate code without comments (cleaner context for LLMs)
context-builder . --no-comments

# Set maximum import depth
context-builder . --max-depth 2

# Get help
context-builder --help
```

### Options

- `<directory>`: Directory to process (required)
- `-o, --output <file>`: Output file path (default: "context.md")
- `-i, --include <patterns...>`: Glob patterns for files to include
- `-e, --exclude <patterns...>`: Glob patterns for files to exclude
- `--no-imports`: Do not follow imports
- `--no-comments`: Remove code comments -- might be useful in some cases, espicially in codebase with tons of great, but not so needed (for llm) comments
- `--max-depth <depth>`: Maximum depth for import traversal (default: 3)
- `--no-file-structure`: Do not include file structure information
- `-V, --version`: Output the version number
- `-h, --help`: Display help for command

### Output Format

The generated context file is formatted as markdown with:

1. A file structure section listing all included files
2. Each file's content in a code block with appropriate syntax highlighting
3. Clear separation between files

This format works well with LLMs as it provides both the code and the contextual information about file structure.

---

## Vision

Once completed, LLM-Context-Builder aims to provide:

### Features

- **Extensive Codebase Support**: Provide your entire codebase, chunked (if needed) to the LLM's maximum token limit.
- **Import Traversal**: Automatically find and include relevant imports/dependencies, so the LLM has the full story.
- **Custom Token Limit**: Specify how many tokens you want to allocate. You'll have complete control over cost and context size.
- **Flexible LLM API Integration**: Work with any LLM provider that accepts text and returns text (OpenAI, Anthropic, etc.).
- **Documentation Parsing**: Feed in your README, wiki pages, or design documents to ensure the LLM fully understands project requirements.
- **Optional Embeddings**: If your repository is massive, you'll be able to use an embeddings-based approach to rank the most relevant sections.
- **Language-Agnostic**: Whether it's JavaScript, TypeScript, Python, or any other language, the tool will simply organize text for the LLM.

### How It Will Work

1. **Collect & Organize**: LLM-Context-Builder will scan specified directories or individual files in your project.
2. **Optional Chunking**: For extremely large files, the tool will break them into smaller segments, configurable to your desired token threshold.
3. **Import/Dependency Traversal**: It will analyze your code for imports or dependencies and collect them automatically.
4. **Prompt Assembly**: It will combine your selected files (or relevant chunks) with your user prompt into a single prompt to send to the LLM.
5. **LLM Invocation**: It will submit that comprehensive prompt to your preferred LLM using your own API key.
6. **Response Handling**: The output will be displayed in full, and you'll be able to save it or pipe it into your own scripts as needed.

### Example Use Cases

#### Example 1: Full Repository + Imports
- Point LLM-Context-Builder to your repository root
- Enable import scanning for JavaScript files
- Ask Claude 3.7, GPT-O1, or Grok 3 for a thorough refactor or detailed debugging suggestions
- The LLM will see entire files, the relevant imports, and the files that import them for context

#### Example 2: Documentation + Bug Report
- Combine your docs, user stories, and relevant code segments
- Provide a bug report or logs during the prompt
- Receive an LLM response that aligns with both functional requirements and your actual code

#### Example 3: "No Fear" Approach
- Set max-context-tokens near the LLM's maximum context window
- Feed an entire codebase unfiltered
- Let the LLM do the heavy lifting
- Embrace the potentially higher cost because the result is a super-informed, single-round fix or improvement

---

## Roadmap

- **Core Functionality** (In Progress)
  - Directory scanning and file collection
  - Basic context assembly
  - Initial CLI interface

- **First Release**
  - Basic Node.js implementation
  - Command-line interface with essential parameters
  - Support for OpenAI and Anthropic APIs
  - Simple documentation

- **Future Features**
  - **Persistent File Mapping**
    - Retain a map of file relationships (like JS imports) for even more robust context assembly
  - **GUI/Web Interface**
    - A web-based UI to browse your project, pick files, and watch real-time LLM cost estimates before sending prompts
  - **Advanced Embeddings**
    - Automatically rank and select the most relevant portions if you want to limit context or queries
  - **Multiple LLM Support**
    - Seamless routing to different models based on factors like cost, token capacity, or performance preferences
  - **File Syncing**
    - Real-time watchers for file changes so you can re-query the LLM with updated code quickly
  - **Configuration Options**
    - Fine-grained control over token allocation, model selection, and cost management

---

## Contribution

As this project is in early development, contributions are especially welcome:

1. Fork this repository
2. Create your branch (`git checkout -b feature/yourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/yourFeature`)
5. Open a Pull Request

We're particularly interested in:
- Core functionality implementation
- Testing and validation approaches
- Documentation improvements
- Feature suggestions

---

## License

This project is licensed under the MIT License. You are free to modify or distribute under the terms of the license.

---

*LLM-Context-Builder aims to give your LLM the robust context it needs, without fear of hitting conservative token limits. If that means a bigger bill—so be it! At least you'll be able to harness the full power of your AI's context window to get the best results, consistently.*
