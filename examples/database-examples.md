# Database Module Examples

This file demonstrates how to use the database module with various examples.

## Basic Usage

```typescript
import {
  createDatabase,
  createUsersDatabase,
  generateId,
  withTimestamps,
} from 'tws-toolbelt';

// Example 1: Create a users database
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

// Get a user by ID
const user = users.getById(1);
console.log(user); // { id: 1, name: 'John Doe', email: 'john@example.com', role: 'super-admin', lastLogin: '...' }

// Find users by criteria
const admins = users.find((user) => user.role.includes('admin'));
console.log(admins);

// Remove a user
await users.remove(1);
```

## Custom Database

```typescript
// Example 2: Create a custom books database
const books = await createDatabase('books.json', 'books', {
  categories: ['fiction', 'non-fiction', 'technical'],
  settings: { autoBackup: true },
});

// Add books with generated IDs and timestamps
await books.add(
  withTimestamps({
    id: generateId(),
    title: 'JavaScript Guide',
    author: 'John Doe',
    category: 'technical',
    isbn: '978-1234567890',
  }),
);

await books.add(
  withTimestamps({
    id: generateId(),
    title: 'The Great Novel',
    author: 'Jane Smith',
    category: 'fiction',
    pages: 350,
  }),
);

// Complex queries
const technicalBooks = books.query((books) =>
  books
    .filter((book) => book.category === 'technical')
    .sort((a, b) => a.title.localeCompare(b.title)),
);

const bookStats = books.query((books) => ({
  total: books.length,
  avgPages:
    books.reduce((sum, book) => sum + (book.pages || 0), 0) / books.length,
  categories: [...new Set(books.map((book) => book.category))],
}));

console.log('Technical books:', technicalBooks);
console.log('Statistics:', bookStats);
```

## E-commerce Example

```typescript
// Example 3: E-commerce system with products and orders
const products = await createProductsDatabase('products.json');
const orders = await createDatabase('orders.json', 'orders', {
  settings: { currency: 'USD', taxRate: 0.08 },
});

// Add products
await products.add({
  id: generateId(),
  name: 'Wireless Headphones',
  description: 'High-quality wireless headphones with noise cancellation',
  price: 199.99,
  category: 'Electronics',
  inStock: true,
  inventory: 50,
});

await products.add({
  id: generateId(),
  name: 'Coffee Mug',
  description: 'Ceramic coffee mug with custom design',
  price: 12.99,
  category: 'Home & Kitchen',
  inStock: true,
  inventory: 100,
});

// Create an order
const orderItems = products.find((p) => p.inStock && p.price < 200);
const order = withTimestamps({
  id: generateId(),
  customerId: 'customer_123',
  items: orderItems.map((item) => ({
    productId: item.id,
    quantity: 1,
    price: item.price,
  })),
  status: 'pending',
  total: orderItems.reduce((sum, item) => sum + item.price, 0),
});

await orders.add(order);

// Update inventory after order
for (const item of orderItems) {
  await products.update(item.id, {
    inventory: item.inventory - 1,
    inStock: item.inventory - 1 > 0,
  });
}

// Query orders by customer
const customerOrders = orders.find(
  (order) => order.customerId === 'customer_123',
);
console.log('Customer orders:', customerOrders);
```

## Task Management System

```typescript
// Example 4: Task management with priorities and due dates
const tasks = await createTasksDatabase('tasks.json');

// Add tasks
await tasks.add(
  withTimestamps({
    id: generateId(),
    title: 'Complete project proposal',
    description: 'Write and submit the Q2 project proposal',
    completed: false,
    priority: 'high',
    dueDate: '2024-03-15',
    tags: ['work', 'important'],
    assignee: 'john@company.com',
  }),
);

await tasks.add(
  withTimestamps({
    id: generateId(),
    title: 'Buy groceries',
    description: 'Weekly grocery shopping',
    completed: false,
    priority: 'medium',
    dueDate: '2024-03-10',
    tags: ['personal', 'routine'],
  }),
);

// Mark task as completed
const completedTask = tasks.findOne((task) => task.title.includes('groceries'));
if (completedTask) {
  await tasks.update(
    completedTask.id,
    updateTimestamp({
      completed: true,
      completedAt: new Date().toISOString(),
    }),
  );
}

// Get pending high-priority tasks
const urgentTasks = tasks.find(
  (task) =>
    !task.completed &&
    task.priority === 'high' &&
    new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due within a week
);

console.log('Urgent tasks:', urgentTasks);

// Generate task report
const taskReport = tasks.query((tasks) => {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter(
    (t) => !t.completed && new Date(t.dueDate) < new Date(),
  ).length;

  return {
    total: tasks.length,
    completed,
    pending,
    overdue,
    completionRate: (completed / tasks.length) * 100,
  };
});

console.log('Task Report:', taskReport);
```

## Advanced Data Operations

```typescript
// Example 5: Advanced operations with custom update logic
const inventory = await createDatabase('inventory.json', 'items', {
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
});

// Batch operations
const newItems = [
  { id: 1, name: 'Widget A', quantity: 100, price: 10.99, location: 'A1' },
  { id: 2, name: 'Widget B', quantity: 50, price: 15.99, location: 'A2' },
  { id: 3, name: 'Widget C', quantity: 75, price: 8.99, location: 'B1' },
];

// Add multiple items
for (const item of newItems) {
  await inventory.add(withTimestamps(item));
}

// Complex update with validation
await inventory.updateData((data) => {
  // Update metadata
  data.lastUpdated = new Date().toISOString();

  // Apply bulk discount to items over certain quantity
  data.items.forEach((item) => {
    if (item.quantity > 75) {
      item.discountPrice = item.price * 0.9; // 10% discount
      item.onSale = true;
    }
  });

  // Add low stock warnings
  const lowStockItems = data.items.filter((item) => item.quantity < 25);
  if (lowStockItems.length > 0) {
    data.alerts = data.alerts || [];
    data.alerts.push({
      type: 'low_stock',
      items: lowStockItems.map((item) => item.id),
      timestamp: new Date().toISOString(),
    });
  }
});

// Query with complex aggregations
const inventoryAnalysis = inventory.query((items) => {
  const totalValue = items.reduce(
    (sum, item) => sum + item.quantity * (item.discountPrice || item.price),
    0,
  );

  const locationStats = items.reduce((stats, item) => {
    const location = item.location.charAt(0); // Get row (A, B, etc.)
    stats[location] = stats[location] || { count: 0, value: 0 };
    stats[location].count += 1;
    stats[location].value += item.quantity * (item.discountPrice || item.price);
    return stats;
  }, {});

  return {
    totalItems: items.length,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    totalValue: totalValue.toFixed(2),
    averagePrice: (
      items.reduce((sum, item) => sum + item.price, 0) / items.length
    ).toFixed(2),
    locationsStats: locationStats,
    onSaleItems: items.filter((item) => item.onSale).length,
  };
});

console.log('Inventory Analysis:', inventoryAnalysis);
```

## Data Migration and Backup

```typescript
// Example 6: Data migration and backup utilities
async function migrateData() {
  const oldDb = await createDatabase('old-data.json', 'records');
  const newDb = await createDatabase('new-data.json', 'records', {
    version: '2.0.0',
    migrated: true,
  });

  // Migrate all records with transformation
  const records = oldDb.getAll();
  for (const record of records) {
    const migratedRecord = {
      ...record,
      id: record.id || generateId(), // Ensure ID exists
      ...withTimestamps({}), // Add timestamps
      version: 2, // Mark as migrated
    };
    await newDb.add(migratedRecord);
  }

  console.log(`Migrated ${records.length} records`);
}

async function backupDatabase() {
  const db = await createDatabase('main-data.json', 'data');
  const backup = await createDatabase(`backup-${Date.now()}.json`, 'data');

  // Copy all data
  const allData = db.raw.data;
  await backup.updateData((data) => {
    Object.assign(data, allData);
    data.backupInfo = {
      originalFile: 'main-data.json',
      timestamp: new Date().toISOString(),
      recordCount: db.count(),
    };
  });

  console.log('Backup created successfully');
}
```

## Performance Tips

```typescript
// Example 7: Performance optimization techniques

// Use batch operations for better performance
async function bulkInsert(db, items) {
  await db.updateData((data) => {
    data.items.push(...items.map((item) => withTimestamps(item)));
  });
}

// Cache frequently accessed data
let cache = new Map();

function getCachedData(db, key) {
  if (!cache.has(key)) {
    const data = db.query((items) => {
      // Complex computation here
      return items
        .filter((item) => item.active)
        .sort((a, b) => b.priority - a.priority);
    });
    cache.set(key, data);
  }
  return cache.get(key);
}

// Clear cache when data changes
async function updateWithCacheClear(db, id, updates) {
  await db.update(id, updates);
  cache.clear(); // Clear cache after updates
}
```

## Error Handling

```typescript
// Example 8: Robust error handling
async function safeDbOperation() {
  try {
    const db = await createDatabase('data.json', 'items');

    // Validate before adding
    const newItem = { id: 1, name: 'Test Item' };
    const existing = db.getById(newItem.id);

    if (existing) {
      throw new Error(`Item with ID ${newItem.id} already exists`);
    }

    await db.add(newItem);
    console.log('Item added successfully');
  } catch (error) {
    console.error('Database operation failed:', error.message);

    // Could implement retry logic, logging, etc.
    // await logError(error)
    // await retryOperation()
  }
}

// Input validation helper
function validateItem(item) {
  if (!item.id) throw new Error('ID is required');
  if (!item.name) throw new Error('Name is required');
  if (typeof item.id !== 'string' && typeof item.id !== 'number') {
    throw new Error('ID must be string or number');
  }
  return true;
}
```

## Real-time Updates (with custom event system)

```typescript
// Example 9: Event-driven database operations
class EventDatabase {
  constructor(db) {
    this.db = db;
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  async add(item) {
    const result = await this.db.add(item);
    this.emit('itemAdded', { item: result });
    return result;
  }

  async update(id, updates) {
    const result = await this.db.update(id, updates);
    this.emit('itemUpdated', { id, updates, item: result });
    return result;
  }

  async remove(id) {
    const result = await this.db.remove(id);
    this.emit('itemRemoved', { id, item: result });
    return result;
  }
}

// Usage
const db = await createDatabase('events.json', 'items');
const eventDb = new EventDatabase(db);

eventDb.on('itemAdded', ({ item }) => {
  console.log('New item added:', item);
});

eventDb.on('itemUpdated', ({ id, updates }) => {
  console.log(`Item ${id} updated:`, updates);
});

await eventDb.add({ id: 1, name: 'Event Item' });
await eventDb.update(1, { name: 'Updated Event Item' });
```
