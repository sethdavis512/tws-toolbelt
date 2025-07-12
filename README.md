# TWS Toolbelt

A comprehensive utility library for everyday development, providing a wide range of helper functions organized into logical modules.

## Installation

```bash
npm install tws-toolbelt
```

## Features

- 🧮 **Math utilities** - Function composition, arithmetic operations, and mathematical helpers
- 📅 **Formatting utilities** - Currency, date formatting, and internationalization helpers
- ⏰ **Date utilities** - Date manipulation, comparison, and time calculations
- 🎯 **Object utilities** - Safe property access, deep cloning, and object manipulation
- 📋 **Array utilities** - Shuffling, chunking, grouping, and array manipulation
- 🎲 **Random generators** - Secure random values, UUIDs, and random data generation
- 🛡️ **Type guards** - Runtime type checking and boolean logic utilities
- 🔐 **Crypto utilities** - Encryption, decryption, and hashing using Web Crypto API
- 🌍 **Environment utilities** - Safe environment variable access and validation
- 📝 **String utilities** - Case conversion, formatting, and text manipulation
- 🌐 **Web utilities** - URL validation, query strings, color conversion, file operations
- 🗄️ **Database utilities** - Simple JSON file databases with functional API, CRUD operations
- ⚡ **General utilities** - Debounce, throttle, memoization, and retry mechanisms

## Usage

### Math Utilities

```typescript
import { add, multiply, pipe, double, triple } from 'tws-toolbelt';

// Basic arithmetic
const sum = add(2, 3); // 5
const product = multiply(4, 5); // 20

// Function composition
const multiply6 = pipe(double, triple);
console.log(multiply6(2)); // 12

// Math helpers
import { clamp, randomBetween } from 'tws-toolbelt';
const clamped = clamp(15, 1, 10); // 10
const random = randomBetween(1, 100); // Random number between 1-100
```

### Formatting Utilities

```typescript
import {
  formatToDollar,
  getRandomDate,
  formatDate,
  getRelativeTime,
} from 'tws-toolbelt';

// Currency formatting
const price = formatToDollar(1234.56); // "$1,234.56"

// Date utilities
const randomDate = getRandomDate(
  new Date('2023-01-01'),
  new Date('2023-12-31'),
);
const formatted = formatDate(new Date(), 'en-US', { weekday: 'long' });
const relative = getRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

### Object Utilities

```typescript
import { get, set, pick, omit, deepClone } from 'tws-toolbelt';

const obj = { user: { profile: { name: 'John' } } };

// Safe property access
const name = get(obj, 'user.profile.name', 'Anonymous'); // 'John'
const missing = get(obj, 'user.settings.theme', 'dark'); // 'dark'

// Object manipulation
set(obj, 'user.profile.age', 30);
const picked = pick(obj, ['user']); // { user: {...} }
const cloned = deepClone(obj); // Deep copy
```

### Array Utilities

```typescript
import { shuffle, unique, chunk, groupBy, range } from 'tws-toolbelt';

const numbers = [1, 2, 3, 4, 5];

// Array manipulation
const shuffled = shuffle(numbers); // Randomized order
const deduped = unique([1, 2, 2, 3, 3]); // [1, 2, 3]
const chunks = chunk(numbers, 2); // [[1, 2], [3, 4], [5]]
const sequence = range(1, 10, 2); // [1, 3, 5, 7, 9]

// Grouping
const users = [
  { name: 'John', role: 'admin' },
  { name: 'Jane', role: 'user' },
  { name: 'Bob', role: 'admin' },
];
const grouped = groupBy(users, (user) => user.role);
// { admin: [...], user: [...] }
```

### Random Utilities

```typescript
import {
  getUniqueId,
  uuid,
  randomString,
  randomHexColor,
  getRandomBool,
} from 'tws-toolbelt';

// ID generation
const id = getUniqueId('user'); // "user-A7B2C9D1"
const uuid4 = uuid(); // "550e8400-e29b-41d4-a716-446655440000"

// Random values
const bool = getRandomBool(75); // 75% chance of true
const color = randomHexColor(); // "#A1B2C3"
const token = randomString(16); // 16-character random string
```

### Type Guards and Boolean Logic

```typescript
import {
  allTrue,
  someTrue,
  isString,
  isNumber,
  isDefined,
  doesStringInclude,
} from 'tws-toolbelt';

// Boolean logic
const conditions = [true, false, true];
const all = allTrue(conditions); // false
const some = someTrue(conditions); // true

// Type guards
const value: unknown = 'hello';
if (isString(value)) {
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}

// String matching
const hasKeyword = doesStringInclude('Hello world', ['world', 'earth']); // true
```

### Crypto Utilities

```typescript
import { generateKey, encryptData, decryptData, hash } from 'tws-toolbelt';

// Encryption (async)
const key = await generateKey();
const { iv, encryptedData } = await encryptData('sensitive data', key);
const decrypted = await decryptData(encryptedData, key, iv);

// Hashing
const hashed = await hash('password123'); // SHA-256 hash
```

### Environment Utilities

```typescript
import {
  getEnvVariable,
  getEnvVariableWithDefault,
  getEnvNumber,
  getEnvBoolean,
  validateEnvVariables,
} from 'tws-toolbelt';

// Environment variable access
const apiUrl = getEnvVariable('API_URL'); // Throws if not found
const port = getEnvNumber('PORT', 3000); // Returns number, defaults to 3000
const isDev = getEnvBoolean('NODE_ENV', false); // Parses boolean
const dbUrl = getEnvVariableWithDefault('DATABASE_URL', 'sqlite://default.db');

// Validation
validateEnvVariables(['API_KEY', 'SECRET']); // Throws if any missing
```

### String Utilities

```typescript
import {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  slugify,
  maskString,
  truncate,
  getInitials,
} from 'tws-toolbelt';

// Case conversion
const camel = camelCase('hello world'); // "helloWorld"
const kebab = kebabCase('helloWorld'); // "hello-world"
const snake = snakeCase('helloWorld'); // "hello_world"

// Text manipulation
const slug = slugify('Hello World! 123'); // "hello-world-123"
const masked = maskString('1234567890', 2, 2); // "12******90"
const short = truncate('This is a long text', 10); // "This is..."
const initials = getInitials('John Doe Smith'); // "JD"
```

### General Utilities

```typescript
import { debounce, throttle, memoize, retry } from 'tws-toolbelt';

// Function control
const debouncedSearch = debounce((query) => search(query), 300);
const throttledScroll = throttle((event) => handleScroll(event), 100);

// Performance optimization
const memoizedExpensiveFunction = memoize((input) =>
  expensiveCalculation(input),
);

// Error handling
const result = await retry(
  async () => {
    return await unreliableApiCall();
  },
  3,
  1000,
); // 3 attempts, 1 second delay
```

### Date Utilities

```typescript
import {
  addDays,
  addMonths,
  isToday,
  diffInDays,
  startOfWeek,
  formatDateOnly,
} from 'tws-toolbelt';

// Date manipulation
const nextWeek = addDays(new Date(), 7);
const nextMonth = addMonths(new Date(), 1);

// Date checking
const today = isToday(new Date());
const daysDiff = diffInDays(new Date('2023-01-01'), new Date('2023-01-15')); // 14

// Date formatting
const weekStart = startOfWeek(new Date());
const dateString = formatDateOnly(new Date()); // "2023-07-12"
```

### Web Utilities

```typescript
import {
  isValidUrl,
  isValidEmail,
  buildQueryString,
  hexToRgb,
  formatFileSize,
} from 'tws-toolbelt';

// Validation
const validUrl = isValidUrl('https://example.com'); // true
const validEmail = isValidEmail('user@example.com'); // true

// URL utilities
const queryString = buildQueryString({ page: 1, search: 'hello' }); // "page=1&search=hello"

// Color utilities
const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }

// File utilities
const fileSize = formatFileSize(1024); // "1 KB"
```

### Database Utilities

```typescript
import {
  createDatabase,
  createUsersDatabase,
  generateId,
  withTimestamps,
} from 'tws-toolbelt';

// Create a users database
const users = await createUsersDatabase('my-users.json');

// Add a user
await users.add({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
});

// Update a user
await users.update(1, {
  role: 'super-admin',
  lastLogin: new Date().toISOString(),
});

// Query users
const user = users.getById(1);
const admins = users.find((user) => user.role.includes('admin'));

// Create custom database
const books = await createDatabase('books.json', 'books');

// Add with timestamps and generated ID
await books.add(
  withTimestamps({
    id: generateId(),
    title: 'JavaScript Guide',
    author: 'John Doe',
    category: 'technical',
  }),
);

// Complex queries
const technicalBooks = books.query((books) =>
  books
    .filter((book) => book.category === 'technical')
    .sort((a, b) => a.title.localeCompare(b.title)),
);
```

## Module Organization

The library is organized into focused modules:

- `math` - Mathematical operations and function composition
- `format` - Formatting utilities for dates, currency, etc.
- `date` - Date manipulation and time utilities
- `object` - Object manipulation and safe property access
- `array` - Array utilities and data structure helpers
- `random` - Random value generation and unique ID creation
- `guards` - Type guards and boolean logic utilities
- `crypto` - Cryptographic operations using Web Crypto API
- `env` - Environment variable utilities
- `string` - String manipulation and text processing
- `web` - URL validation, query strings, color conversion, file utilities
- `database` - JSON file databases with functional API and CRUD operations
- `utils` - General utilities like debounce, throttle, memoize, retry

You can import from specific modules:

```typescript
import { add, multiply } from 'tws-toolbelt/math';
import { formatToDollar } from 'tws-toolbelt/format';
```

Or import everything:

```typescript
import * as toolbelt from 'tws-toolbelt';
```

## TypeScript Support

This library is written in TypeScript and provides full type safety with comprehensive type definitions.

## Browser and Node.js Support

Most utilities work in both browser and Node.js environments. The crypto utilities require:

- Modern browsers with Web Crypto API support
- Node.js 16+ with Web Crypto API support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
