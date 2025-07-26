# prompt-new-mcp

A Model Context Protocol (MCP) server for saving and managing prompts. This tool allows you to save prompts with timestamps and list previously saved prompts.

<a href="https://glama.ai/mcp/servers/@seungwonme/prompt-new-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@seungwonme/prompt-new-mcp/badge" alt="prompt-new-mcp MCP server" />
</a>

## Installation

You can run this MCP server directly using npx without installation:

```bash
npx prompt-new-mcp
```

## Usage with Claude Desktop

Add this server to your Claude Desktop configuration:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prompt-new-mcp": {
      "command": "npx",
      "args": ["-y", "prompt-new-mcp"]
    }
  }
}
```

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "prompt-new-mcp": {
      "command": "npx",
      "args": ["-y", "prompt-new-mcp"]
    }
  }
}
```

## Available Tools

### save
Saves a prompt with a timestamp to the `prompts` directory.

**Parameters:**
- `name` (string): The name for the prompt file
- `content` (string): The prompt content to save

### list
Lists saved prompts in the prompts directory.

**Parameters:**
- `limit` (number, optional): Maximum number of prompts to return (default: 20)

## File Organization

Prompts are saved in the `prompts` directory with the following naming convention:
`YYYYMMDD_HHMMSS_<sanitized-name>.md`

Example: `20250125_143022_user-question.md`

## Requirements

- Node.js 18 or higher
- Compatible with Claude Desktop and other MCP clients

## License

MIT