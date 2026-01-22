/**
 * Application configuration
 * Centralizes environment-based feature flags
 */
export const appConfig = {
  /**
   * Controls whether new user registrations are allowed
   * Set NEXT_PUBLIC_REGISTRATIONS_ENABLED=false to disable registrations
   * @default true
   */
  registrationsEnabled: process.env.NEXT_PUBLIC_REGISTRATIONS_ENABLED !== 'false'
} as const;
