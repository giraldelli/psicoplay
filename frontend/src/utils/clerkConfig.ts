export const CLERK_PUBLISHABLE_KEY: string =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.CLERK_PUBLISHABLE_KEY as string | undefined) ||
  '';

export function isClerkConfigured(): boolean {
  return (
    Boolean(CLERK_PUBLISHABLE_KEY) &&
    CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    CLERK_PUBLISHABLE_KEY !== 'pk_test_your_clerk_publishable_key_here'
  );
}

