# LLM-Context-Builder  
  
A tool for developers who want to provide maximum context to Large Language Models (LLMs) without worrying about conservative token usage. By using your own API keys, you control how many tokens you send (up to the model's supported maximum), enabling the LLM to receive fuller context, reduce guesswork, and provide more accurate and context-aware code suggestions or fixes.  
  
## Table of Contents  
1. [Overview & Story](#overview--story)    
2. [Why LLM-Context-Builder?](#why-llm-context-builder)    
3. [Features](#features)    
4. [How It Works](#how-it-works)    
5. [Installation](#installation)    
6. [Usage](#usage)    
7. [Configuration](#configuration)    
8. [Examples & Workflows](#examples--workflows)    
9. [Roadmap](#roadmap)    
11. [License](#license)    
12. [Acknowledgments](#acknowledgments)    
  
---  
  
## Overview & Story  
  
### Frustration with Existing Tools  
  
When working on complex projects, developers often need the LLM to have a comprehensive understanding of entire files, their imports, and the broader context of a codebase. Tools like Cursor and Windsurf are designed to help, but they can be surprisingly "token-shy."   
  
- They may read files only 100 lines at a time.    
- They slice the codebase into small chunks to avoid high usage costs.    
- Their pricing model is often based on the number of requests, meaning they generally optimize for minimizing tokens per request.  
  
However, many developers are more than willing to pay for larger token usage if it means the LLM truly understands the full context and can provide better solutions. It's frustrating to see partial context lead to incomplete or superficial answers, ultimately wasting time—as well as AI resources—because the LLM can't see the bigger picture.  
  
**LLM-Context-Builder** is the solution for developers who prefer to throw the entire necessary context at the LLM. By using your own API key, you control how large your prompt is (up to the LLM's token limit). If you want to exhaust the maximum allowable input tokens so you can feed entire files, entire sets of imports, or even your entire repository, that is completely up to you.  
  
---  
  
## Why LLM-Context-Builder?  
  
1. **Full Context Utilization**: Stop losing relevant information. Provide entire file contents, all imports, and any supporting files so the LLM knows exactly what you're dealing with.    
2. **No Fear of High Token Usage**: If you don't mind paying for it, why not give the LLM everything it needs? Our tool is designed to let you do just that.    
3. **Developer-focused**: Instead of reading files in tiny 100-line increments, this tool can upload entire files and traverse import/require statements for deeper context.    
4. **Reduced Iterations**: By supplying more context upfront, you (and the LLM) avoid multiple back-and-forth queries trying to fill gaps.    
5. **No Surprises**: Because you use your own API key, you see cost details from your LLM provider directly. Decide for yourself how many tokens are worth your time and money.  
  
---  
  
## Features  
  
- **Extensive Codebase Support**: Provide your entire codebase, chunked (if needed) to the LLM's maximum token limit.    
- **Import Traversal**: Automatically find and include relevant imports/dependencies, so the LLM has the full story.    
- **Custom Token Limit**: Specify how many tokens you want to allocate. You have complete control over cost and context size.    
- **Flexible LLM API Integration**: Works with any LLM provider that accepts text and returns text (OpenAI, Anthropic, etc.).    
- **Documentation Parsing**: Feed in your README, wiki pages, or design documents to ensure the LLM fully understands project requirements.    
- **Optional Embeddings**: If your repository is massive, you can use an embeddings-based approach to rank the most relevant sections—but it's your choice. You can also just load everything.    
- **Language-Agnostic**: Whether it's JavaScript, TypeScript, Python, or any other language, the tool simply organizes text for the LLM.  
  
---  
  
## How It Works  
  
1. **Collect & Organize**: LLM-Context-Builder scans specified directories or individual files in your project.    
2. **Optional Chunking**: For extremely large files, the tool can break them into smaller segments. This is configurable to your desired token threshold.    
3. **Import/Dependency Traversal**: (When enabled) it analyzes your code for imports or dependencies and collects them automatically.    
4. **Prompt Assembly**: Combines your selected files (or relevant chunks) with your user prompt into a single prompt that you can send to the LLM.    
5. **LLM Invocation**: Submits that comprehensive prompt to your preferred LLM using your own API key.    
6. **Response Handling**: The output is displayed in full, and you can save it or pipe it into your own scripts as needed.  
  
---  
  
## Installation  
  
1. **Clone this repository**:  
   ```bash  
   git clone https://github.com/YourUsername/LLM-Context-Builder.git  
   cd LLM-Context-Builder  
   ```

2. **Install dependencies**:  
   If the tool is Node-based:
   ```bash
   npm install  
   ```
   
---
 
## Usage
 
WiP

### Basic Command Line
 
 WiP

3. **Receive Output**:
   WiP

 
## Configuration
 
| Variable Name | Description | Default Value |
|---------------|-------------|---------------|
| LLM_PROVIDER | Which LLM provider to use (openai, anthropic, etc.). | openai (example) |
| API_KEY | Your API key for the chosen provider. | None (must provide) |
| MODEL_NAME | The specific model name (e.g., gpt-4, gpt-3.5-turbo, claude-v1, etc.). | gpt-4 |
| MAX_TOKENS_CONTEXT | Maximum tokens to be used for context. | 7500 |
| MAX_TOKENS_COMPLETION | Maximum tokens to be used for the LLM response (completion). | 1500 |
| USE_EMBEDDINGS | Whether to embed and rank file chunks or just feed them directly to the LLM (true/false). | false |
 		
**Note**: If you set MAX_TOKENS_CONTEXT to a high number, you will pay more. That's exactly the point for some developers—comprehensive context can save time and yield more accurate results.

---
 
## Examples & Workflows
 
### Example 1: Full Repository + Imports
- Point LLM-Context-Builder to your repository root.
- Enable import scanning for TS/JS files.
- Ask the LLM for a thorough refactor or detailed debugging suggestions.
- The LLM sees entire files, the relevant imports, and the files that import them for context.

### Example 2: Documentation + Bug Report
- Combine your docs, user stories, and relevant code segments.
- Provide a bug report or logs during the prompt.
- Receive an LLM response that aligns with both functional requirements and your actual code.

### Example 3: "No Fear" Approach
- Set max-context-tokens near the LLM's maximum (like 32,000 tokens for GPT-4 32K).
- Feed an entire codebase unfiltered.
- Let the LLM do the heavy lifting.
- Embrace the potentially higher cost because the result is a super-informed, single-round fix or improvement.
 
---
 
## Roadmap
 
- **Persistent File Mapping**
  - Retain a map of file relationships (like TS/JS imports, Python imports, etc.) for even more robust context assembly.
- **GUI/Web Interface**
  - A web-based UI to browse your project, pick files, and watch real-time LLM cost estimates before sending prompts.
- **Advanced Embeddings**
  - Automatically rank and select the most relevant portions if you want to limit context or queries.
- **Multiple LLM Support**
  - Seamless routing to different models based on factors like cost, token capacity, or performance preferences.
- **File Syncing**
  - Real-time watchers for file changes so you can re-query the LLM with updated code quickly.

 
---
 
## License
 
This project is licensed under the MIT License. You are free to modify or distribute under the terms of the license.
 
---
 
## Acknowledgments
 
- Cursor and Windsurf for showing how an AI assistant can help developers—and for illustrating the limitations when tools are token-shy due to their economic models
 
Use LLM-Context-Builder to finally give your LLM the robust context it needs, without fear of hitting conservative token limits. If that means a bigger bill—so be it! At least you'll be able to harness the full power of your AI's context window to get the best results, consistently.