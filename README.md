# clean-pack

A CLI tool to clean up node_modules directories in your projects.

## Features

- 🔍 Recursively finds all node_modules directories
- 🧹 Safely removes found directories
- 📊 Shows real-time progress
- 🎨 Beautiful CLI interface using Ink

## Installation

```bash
pnpm install -g clean-pack
```

## Usage

Run in the current directory:
```bash
clean-pack
```

Run in a specific directory:
```bash
clean-pack ./path/to/project
```

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Build the project:
   ```bash
   pnpm build
   ```
4. Link the package locally:
   ```bash
   pnpm link --global
   ```

## License

MIT 