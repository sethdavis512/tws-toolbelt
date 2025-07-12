import { JSONFilePreset } from 'lowdb/node';
import { getUniqueId } from './random.js';

/**
 * Database instance type with utility functions
 */
export type DatabaseInstance<T = any> = {
  getAll: () => T[];
  getById: (id: string | number) => T | undefined;
  find: (predicate: (item: T) => boolean) => T[];
  findOne: (predicate: (item: T) => boolean) => T | undefined;
  add: (item: T) => Promise<T>;
  update: (id: string | number, updates: Partial<T>) => Promise<T | undefined>;
  remove: (id: string | number) => Promise<T | undefined>;
  count: () => number;
  clear: () => Promise<void>;
  query: <R>(callback: (items: T[]) => R) => R;
  updateData: (callback: (data: any) => void) => Promise<void>;
  raw: any;
};

/**
 * Creates a new database instance with utility functions
 * @param filename - The JSON file path
 * @param collectionName - The name of the main collection (e.g., 'cars', 'users')
 * @param defaultData - Default data structure
 * @returns Promise<DatabaseInstance> Database instance with utility functions
 */
export async function createDatabase<T extends { id: string | number }>(
  filename: string,
  collectionName: string,
  defaultData: Record<string, any> = {},
): Promise<DatabaseInstance<T>> {
  // Set up default structure with the collection
  const dbDefault = { [collectionName]: [], ...defaultData };
  const db = await JSONFilePreset(filename, dbDefault);

  return {
    // Get all items
    getAll: () => db.data[collectionName],

    // Get item by ID
    getById: (id: string | number) =>
      db.data[collectionName].find((item: T) => item.id === id),

    // Find items by criteria
    find: (predicate: (item: T) => boolean) =>
      db.data[collectionName].filter(predicate),

    // Find one item by criteria
    findOne: (predicate: (item: T) => boolean) =>
      db.data[collectionName].find(predicate),

    // Add new item
    add: async (item: T) => {
      await db.update((data) => {
        data[collectionName].push(item);
      });
      return item;
    },

    // Update item by ID
    update: async (id: string | number, updates: Partial<T>) => {
      await db.update((data) => {
        const index = data[collectionName].findIndex(
          (item: T) => item.id === id,
        );
        if (index !== -1) {
          data[collectionName][index] = {
            ...data[collectionName][index],
            ...updates,
          };
        }
      });
      return db.data[collectionName].find((item: T) => item.id === id);
    },

    // Remove item by ID
    remove: async (id: string | number) => {
      let removed: T | undefined = undefined;
      await db.update((data) => {
        const index = data[collectionName].findIndex(
          (item: T) => item.id === id,
        );
        if (index !== -1) {
          removed = data[collectionName].splice(index, 1)[0];
        }
      });
      return removed;
    },

    // Count items
    count: () => db.data[collectionName].length,

    // Clear all items
    clear: async () => {
      await db.update((data) => {
        data[collectionName] = [];
      });
    },

    // Custom query function for complex operations
    query: <R>(callback: (items: T[]) => R) =>
      callback(db.data[collectionName]),

    // Custom update function for complex operations
    updateData: async (callback: (data: any) => void) => {
      await db.update(callback);
    },

    // Access to raw lowdb instance for advanced operations
    raw: db,
  };
}

/**
 * User type definition
 */
export type User = {
  id: string | number;
  name: string;
  email: string;
  age?: number;
  role?: string;
  createdAt?: string;
  [key: string]: any;
};

/**
 * Create a users database specifically
 * @param filename - The JSON file path (defaults to 'users.json')
 * @returns Promise<DatabaseInstance<User>> Users database instance
 */
export async function createUsersDatabase(
  filename: string = 'users.json',
): Promise<DatabaseInstance<User>> {
  return createDatabase<User>(filename, 'users', {
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      description: 'Users database',
    },
  });
}

/**
 * Create a generic products database
 * @param filename - The JSON file path (defaults to 'products.json')
 * @returns Promise<DatabaseInstance> Products database instance
 */
export async function createProductsDatabase(
  filename: string = 'products.json',
) {
  type Product = {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    category?: string;
    inStock?: boolean;
    [key: string]: any;
  };

  return createDatabase<Product>(filename, 'products', {
    categories: [],
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      description: 'Products database',
    },
  });
}

/**
 * Create a tasks/todo database
 * @param filename - The JSON file path (defaults to 'tasks.json')
 * @returns Promise<DatabaseInstance> Tasks database instance
 */
export async function createTasksDatabase(filename: string = 'tasks.json') {
  type Task = {
    id: string | number;
    title: string;
    description?: string;
    completed: boolean;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
    [key: string]: any;
  };

  return createDatabase<Task>(filename, 'tasks', {
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      description: 'Tasks database',
    },
  });
}

/**
 * Utility function to generate unique IDs
 * @returns string A unique identifier
 */
export function generateId(): string {
  return getUniqueId('', 12);
}

/**
 * Utility function to create timestamped records
 * @param data - The data to timestamp
 * @returns Object with createdAt and updatedAt fields
 */
export function withTimestamps<T extends Record<string, any>>(
  data: T,
): T & { createdAt: string; updatedAt: string } {
  const now = new Date().toISOString();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Utility function to update the updatedAt timestamp
 * @param data - The data to update
 * @returns Object with updated updatedAt field
 */
export function updateTimestamp<T extends Record<string, any>>(
  data: T,
): T & { updatedAt: string } {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
  };
}
