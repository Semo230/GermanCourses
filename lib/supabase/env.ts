// Both values are public: every permission comes from row-level security (SPEC-2.md 2.9).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://germancourses.asmaaabdelhamidm.workers.dev";
