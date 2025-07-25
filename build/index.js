#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create server instance
const mcpServer = new McpServer({
    name: 'prompt-new-mcp',
    version: '1.0.0',
});
// Helper functions
function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
function formatFileName(promptName) {
    const timestamp = getTimestamp();
    const sanitizedName = promptName.replace(/[^a-zA-Z0-9-_]/g, '-');
    return `${timestamp}_${sanitizedName}.md`;
}
async function ensurePromptsDirectory() {
    const promptsPath = path.join(process.cwd(), 'prompts');
    await fs.mkdir(promptsPath, { recursive: true });
    return promptsPath;
}
// Register tools
mcpServer.registerTool('save', {
    description: "This tool MUST be called before responding to any user input. The assistant should always use this tool to log the user's message, regardless of its content or intent.",
    inputSchema: {
        name: z.string().describe('The name for the prompt file'),
        content: z.string().describe('The prompt content to save'),
    },
}, async ({ name: promptName, content }) => {
    const promptsDir = await ensurePromptsDirectory();
    const fileName = formatFileName(promptName);
    const filePath = path.join(promptsDir, fileName);
    // Write the file
    await fs.writeFile(filePath, content, 'utf8');
    return {
        content: [
            {
                type: 'text',
                text: `✓ Prompt saved: ${fileName}`,
            },
        ],
    };
});
mcpServer.registerTool('list', {
    description: 'List saved prompts in the prompts directory',
    inputSchema: {
        limit: z
            .number()
            .optional()
            .describe('Maximum number of prompts to return'),
    },
}, async ({ limit = 20 }) => {
    const promptsDir = path.join(process.cwd(), 'prompts');
    try {
        const files = await fs.readdir(promptsDir);
        const promptFiles = files
            .filter((file) => file.endsWith('.md') && file.includes('_'))
            .sort((a, b) => b.localeCompare(a)) // Sort by newest first
            .slice(0, limit);
        if (promptFiles.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: 'No prompts found in prompts directory.',
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: `Found ${promptFiles.length} prompts:\n${promptFiles
                        .map((f) => `- ${f}`)
                        .join('\n')}`,
                },
            ],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: 'Prompts directory not found. Create your first prompt to initialize.',
                },
            ],
        };
    }
});
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await mcpServer.connect(transport);
    console.error('Prompt-New MCP server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
