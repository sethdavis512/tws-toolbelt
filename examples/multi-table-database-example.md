# Multi-Table Database Examples

This document shows how to use the enhanced multi-table database functionality.

## Basic Multi-Table Setup

```typescript
import { createMultiTableDatabase, createAppDatabase } from './src/database.js';

// Create a database with multiple tables
const db = await createMultiTableDatabase('myapp.json', {
  users: [],
  products: [],
  orders: [],
  categories: [],
});

// Or use the pre-configured app database
const appDb = await createAppDatabase('app.json');
```

## Working with Tables

### Define Types

```typescript
type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
};

type Order = {
  id: string;
  userId: string;
  productIds: string[];
  total: number;
  createdAt: string;
};
```

### Table Operations

```typescript
// Get table instances with type safety
const usersTable = db.table<User>('users');
const productsTable = db.table<Product>('products');
const ordersTable = db.table<Order>('orders');

// Add records
await usersTable.add({
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
});

await productsTable.add({
  id: 'prod-1',
  name: 'Laptop',
  price: 999.99,
  categoryId: 'electronics',
});

// Query records
const allUsers = usersTable.getAll();
const user = usersTable.getById('user-1');
const adults = usersTable.find((user) => (user.age || 0) >= 18);
const expensiveProducts = productsTable.find((product) => product.price > 500);

// Update and delete
await usersTable.update('user-1', { age: 31 });
await productsTable.remove('prod-1');

// Count and clear
console.log(`Total users: ${usersTable.count()}`);
await usersTable.clear();
```

## Dynamic Table Management

```typescript
// List existing tables
console.log('Tables:', db.listTables()); // ['users', 'products', 'orders', 'categories']

// Create new tables dynamically
await db.createTable('reviews', []);
await db.createTable('tags', [
  { id: 'tag-1', name: 'JavaScript', color: '#f7df1e' },
]);

// Check if table exists
const reviewsTable = db.table('reviews');
if (reviewsTable.exists()) {
  console.log('Reviews table is ready!');
}

// Drop tables
await db.dropTable('reviews');
```

## Complex Operations

### Cross-Table Queries

```typescript
// Find orders with user information
const ordersWithUsers = ordersTable.query((orders) =>
  orders.map((order) => ({
    ...order,
    user: usersTable.getById(order.userId),
  })),
);

// Find products by category
const electronicsProducts = productsTable.find(
  (product) => product.categoryId === 'electronics',
);
```

### Batch Operations

```typescript
// Use updateData for complex multi-table operations
await db.updateData((data) => {
  // Add multiple records across tables
  data.users.push(
    { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: 'user-3', name: 'Bob Johnson', email: 'bob@example.com' },
  );

  data.products.push(
    { id: 'prod-2', name: 'Mouse', price: 29.99, categoryId: 'electronics' },
    { id: 'prod-3', name: 'Book', price: 19.99, categoryId: 'books' },
  );

  // Update metadata
  data._metadata.lastUpdated = new Date().toISOString();
});
```

## Comparison with Single-Table Database

### Single Table (Original)

```typescript
// Original single-table approach
const usersDb = await createDatabase<User>('users.json', 'users');
const productsDb = await createDatabase<Product>('products.json', 'products');

// Requires multiple database files
await usersDb.add({ id: '1', name: 'John', email: 'john@example.com' });
await productsDb.add({
  id: '1',
  name: 'Laptop',
  price: 999,
  categoryId: 'electronics',
});
```

### Multi-Table (Enhanced)

```typescript
// Multi-table approach - single database file
const db = await createMultiTableDatabase('app.json', {
  users: [],
  products: [],
});

// All tables in one database
await db
  .table<User>('users')
  .add({ id: '1', name: 'John', email: 'john@example.com' });
await db
  .table<Product>('products')
  .add({ id: '1', name: 'Laptop', price: 999, categoryId: 'electronics' });
```

## Benefits

1. **Single Database File**: All related data in one JSON file
2. **Type Safety**: Full TypeScript support for each table
3. **Dynamic Tables**: Create/drop tables at runtime
4. **Cross-Table Operations**: Easy relationships between tables
5. **Metadata Tracking**: Built-in table tracking and versioning
6. **Familiar API**: Same operations as single-table database
