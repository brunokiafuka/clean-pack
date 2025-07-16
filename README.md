# clean-pack

A beautiful CLI tool to clean up node_modules directories in your projects with style! 🧹✨



## Features

- 🔍 Recursively finds all node_modules directories in your project
- 📊 Shows size and last modified date for each directory
- ⌨️ Interactive keyboard navigation and selection
- 🔎 Real-time search functionality
- 📜 Scrollable list for large projects
- 🎨 Beautiful CLI interface using Ink
- 💾 Shows total space saved after cleanup
- ✅ Safe deletion with confirmation

## Installation

```bash
# Using npm
npm install -g clean-pack

# Using yarn
yarn global add clean-pack

# Using pnpm
pnpm add -g clean-pack
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

### Keyboard Controls

- `↑/↓` - Navigate through packages
- `Space` - Select/deselect package
- `a` - Select/deselect all packages
- `/` - Enter search mode
- `Enter` - Confirm deletion
- `Esc` - Exit search mode

## Why clean-pack?

- **Space Management**: Easily identify and remove unused node_modules directories
- **Project Cleanup**: Perfect for cleaning up old projects and freeing disk space
- **Visual Feedback**: See exactly how much space you're saving
- **Safe Operation**: Confirmation required before deletion
- **User-Friendly**: Beautiful interface with intuitive controls

## Development

1. Clone the repository
   ```bash
   git clone https://github.com/brunokiafuka/clean-pack.git
   cd clean-pack
   ```

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Bruno Kiafuka](https://github.com/brunokiafuka) 