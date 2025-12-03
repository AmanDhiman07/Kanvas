// Reads and validates VITE_* environment variables

interface EnvConfig {
  apiBaseUrl: string;
}

export function getEnvConfig(): EnvConfig {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  };
}

