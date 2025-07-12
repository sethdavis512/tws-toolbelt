/**
 * Environment variable utilities
 */

/**
 * Safely retrieves an environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is undefined or doesn't exist
 */
export function getEnvVariable(key: string): string {
  if (key === undefined) {
    throw new Error(`"${key}" is undefined`);
  }

  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Environment variable "${key}" does not exist on process.env`,
    );
  }

  return value;
}

/**
 * Safely retrieves an environment variable with a default value
 * @param key - The environment variable key
 * @param defaultValue - The default value to return if the variable doesn't exist
 * @returns The environment variable value or the default value
 */
export function getEnvVariableWithDefault(
  key: string,
  defaultValue: string,
): string {
  try {
    return getEnvVariable(key);
  } catch {
    return defaultValue;
  }
}

/**
 * Checks if an environment variable exists
 * @param key - The environment variable key
 * @returns True if the variable exists, false otherwise
 */
export function hasEnvVariable(key: string): boolean {
  return key in process.env && process.env[key] !== undefined;
}

/**
 * Gets an environment variable as a number
 * @param key - The environment variable key
 * @param defaultValue - Optional default value
 * @returns The parsed number value
 * @throws Error if the variable doesn't exist (when no default provided) or can't be parsed as a number
 */
export function getEnvNumber(key: string, defaultValue?: number): number {
  const value =
    defaultValue !== undefined
      ? getEnvVariableWithDefault(key, defaultValue.toString())
      : getEnvVariable(key);

  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(
      `Environment variable "${key}" cannot be parsed as a number: ${value}`,
    );
  }

  return parsed;
}

/**
 * Gets an environment variable as a boolean
 * @param key - The environment variable key
 * @param defaultValue - Optional default value
 * @returns The parsed boolean value
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean {
  const value =
    defaultValue !== undefined
      ? getEnvVariableWithDefault(key, defaultValue.toString())
      : getEnvVariable(key);

  const lowercased = value.toLowerCase();
  return lowercased === 'true' || lowercased === '1' || lowercased === 'yes';
}

/**
 * Validates that all required environment variables are present
 * @param keys - Array of required environment variable keys
 * @throws Error if any required variables are missing
 */
export function validateEnvVariables(keys: string[]): void {
  const missing = keys.filter((key) => !hasEnvVariable(key));
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}
