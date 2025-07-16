# Copilot Instructions for TWS Toolbelt

## Project Overview

- **TWS Toolbelt** is a modular TypeScript utility library for Node.js and browser environments, providing helpers for math, formatting, dates, objects, arrays, random values, type guards, crypto, environment, strings, web, and database operations.
- Utilities are organized by domain in `src/` (e.g., `math.ts`, `object.ts`, `database.ts`).
- Example usage and advanced patterns are documented in `README.md` and `examples/`.

## Key Patterns & Conventions

- **Module Importing:**
  - Import from specific modules (e.g., `import { add } from 'tws-toolbelt/math'`) or the root (`import * as toolbelt from 'tws-toolbelt'`).
- **TypeScript First:**
  - All modules are fully typed. Type safety is expected in all contributions and examples.
- **Database Utilities:**
  - JSON file-based, functional API. Supports both single-table and multi-table (see `examples/multi-table-database-example.md`).
  - Multi-table DB: Use `createMultiTableDatabase` and `db.table<T>('tableName')` for type-safe access.
  - Batch and cross-table operations use `db.updateData`.
  - Dynamic table creation and deletion is supported at runtime.
- **Testing:**
  - Tests are colocated in `src/` with `.test.ts` suffix (e.g., `utils.test.ts`).
  - Use Jest-style assertions and structure.
- **General Utilities:**
  - Prefer functional, stateless helpers. Avoid side effects unless clearly documented.
  - Use provided helpers for common tasks (e.g., `debounce`, `memoize`, `retry`).

## Developer Workflows

- **Build:**
  - Standard TypeScript build via `tsc` (see `tsconfig.json`).
- **Test:**
  - Run all tests with `npm test` (ensure test runner is configured in `package.json`).
- **Examples:**
  - See `examples/` for real-world usage, especially for database patterns and advanced operations.

## Project-Specific Notes

- **Database modules** are a major focus; see `examples/database-examples.md` and `examples/multi-table-database-example.md` for idiomatic usage, including event-driven and batch operations.
- **No external dependencies** for most modules; crypto uses Web Crypto API (Node.js 16+ required).
- **Contributions** should follow the modular structure and TypeScript conventions.

## References

- `README.md` for module documentation and usage patterns
- `examples/` for advanced and real-world scenarios
- `src/` for implementation and test patterns

---

For new AI agents: Start by reviewing `README.md` and `examples/` to understand module boundaries and idiomatic usage. When in doubt, prefer stateless, typed, and composable helpers. For database work, always check for multi-table patterns and type safety.
