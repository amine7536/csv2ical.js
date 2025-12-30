# csv2ical

[![CI](https://github.com/amine7536/csv2ical.js/actions/workflows/ci.yml/badge.svg)](https://github.com/amine7536/csv2ical.js/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/csv2ical.svg)](https://www.npmjs.com/package/csv2ical)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

A modern, TypeScript-based CLI tool to convert CSV files to iCalendar (ICS) format.

## Features

- 🚀 **Fast & Efficient**: Built with modern Node.js and TypeScript
- 📅 **Standards Compliant**: Generates valid iCalendar files
- 🎯 **Flexible**: Support for custom delimiters and date formats
- 🐳 **Docker Ready**: Includes Dockerfile for containerized usage
- ✅ **Well Tested**: Comprehensive test coverage with Vitest
- 📦 **Type Safe**: Full TypeScript support with type definitions

## Installation

### NPM

```bash
npm install -g csv2ical
```

### From Source

```bash
git clone https://github.com/amine7536/csv2ical.js.git
cd csv2ical.js
npm install
npm run build
npm link
```

### Docker

```bash
docker pull ghcr.io/amine7536/csv2ical.js:latest
```

## Usage

### CLI

```bash
csv2ical -i input.csv -o output.ics -d "," -H
```

### Options

| Option | Alias | Description | Default | Required |
|--------|-------|-------------|---------|----------|
| `-i` | `--input` | Input CSV file | - | Yes |
| `-o` | `--output` | Output ICS file | - | Yes |
| `-d` | `--delimiter` | CSV delimiter character | `,` | No |
| `-H` | `--headers` | CSV contains headers | `false` | No |
| `--rows` | - | Column indices for event fields | `0,1,2,3,4` | No |
| `--dateformat` | - | Custom date format (moment.js style) | - | No |

### CSV Format

Your CSV file should contain the following columns (in order):

1. **Subject**: Event title/summary
2. **Start Date**: Event start date and time
3. **End Date**: Event end date and time
4. **Description**: Event description
5. **Location**: Event location

#### Example CSV

```csv
"Subject","Start Date","End Date","Description","Location"
"Team Meeting","2025-01-15 09:00","2025-01-15 10:00","Weekly sync","Conference Room A"
"Project Deadline","2025-01-20 17:00","2025-01-20 18:00","Submit deliverables","Office"
"Client Call","2025-01-22 14:00","2025-01-22 15:00","Q1 Review","Zoom"
```

### Examples

#### Basic usage with headers

```bash
csv2ical -i events.csv -o calendar.ics -H
```

#### Custom delimiter (semicolon)

```bash
csv2ical -i events.csv -o calendar.ics -d ";" -H
```

#### Custom date format

```bash
csv2ical -i events.csv -o calendar.ics -H --dateformat="DD/MM/YYYY HH:mm"
```

#### Custom column order

```bash
csv2ical -i events.csv -o calendar.ics -H --rows=0,2,3,1,4
```

### Docker Usage

```bash
# Using docker run
docker run -v $(pwd)/data:/data ghcr.io/amine7536/csv2ical.js:latest \
  -i /data/input.csv -o /data/output.ics -H

# Using docker-compose
docker-compose up
```

## Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/amine7536/csv2ical.js.git
cd csv2ical.js

# Install dependencies
npm install

# Run in development mode
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the TypeScript project |
| `npm run dev` | Build in watch mode |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Lint the code |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run ci` | Run all checks (CI pipeline) |

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Architecture

The project follows modern TypeScript best practices:

- **TypeScript**: Strict mode enabled for maximum type safety
- **ESM Modules**: Uses modern ES module syntax
- **Testing**: Vitest for fast, modern testing
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier for consistent code style
- **CI/CD**: GitHub Actions for automated testing and deployment

## Dependencies

- [csv-parse](https://csv.js.org/parse/): Modern CSV parser
- [ical-generator](https://github.com/sebbo2002/ical-generator): iCalendar file generator
- [winston](https://github.com/winstonjs/winston): Logging library
- [yargs](https://yargs.js.org/): Command-line argument parser

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- All tests pass (`npm test`)
- Code is formatted (`npm run format`)
- No linting errors (`npm run lint`)
- TypeScript compiles (`npm run typecheck`)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Amine Benseddik**
- Email: amine.benseddik@gmail.com
- GitHub: [@amine7536](https://github.com/amine7536)

## Acknowledgments

This tool is built with:
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [Vitest](https://vitest.dev/)
- [ical-generator](https://github.com/sebbo2002/ical-generator)
- [csv-parse](https://csv.js.org/parse/)

## Changelog

### v1.0.0 (2025)
- 🎉 Complete rewrite in TypeScript
- ✅ Added comprehensive test suite
- 🐳 Added Docker support
- 🔄 Added CI/CD with GitHub Actions
- 📦 Modern ESM module support
- 🎨 Added ESLint and Prettier
- 📚 Improved documentation

### v0.1.2 (Legacy)
- Original JavaScript implementation
