import { createClient } from "@supabase/supabase-js";
import { HybridStorage } from "./memoryStorage";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Store the original console.error function
const originalConsoleError = console.error;

// Override console.error to filter out specific Supabase errors
console.error = (...args: unknown[]) => {
  // Check each argument for the error patterns
  const shouldFilter = args.some((arg) => {
    let argString: string;

    // Convert argument to string, handling objects
    if (typeof arg === "object" && arg !== null) {
      try {
        argString = JSON.stringify(arg);
      } catch {
        argString = String(arg);
      }
    } else {
      argString = String(arg);
    }

    // Check if this argument contains the patterns we want to filter
    return (
      argString.includes("user_already_exists") ||
      argString.includes("User already registered") ||
      argString.includes("invalid_credentials") ||
      argString.includes("Invalid login credentials") ||
      (argString.includes("Supabase request failed") &&
        argString.includes("user_already_exists")) ||
      (argString.includes("Supabase request failed") &&
        argString.includes("invalid_credentials"))
    );
  });

  // If any argument matches our filter criteria, don't log the error
  if (shouldFilter) {
    return;
  }

  // For all other errors, use the original console.error
  originalConsoleError.apply(console, args);
};

// Log environment details
console.log("🔍 SUPABASE ENVIRONMENT CHECK:");
console.log("🔍 Environment:", {
  isIframe: window !== window.top,
  isSecureContext: window.isSecureContext,
  protocol: window.location.protocol,
  origin: window.location.origin,
  isBoltEnvironment:
    window.location.hostname.includes("bolt.new") ||
    window.location.hostname.includes("webcontainer") ||
    navigator.userAgent.includes("WebContainer"),
});

// Create hybrid storage instance - SINGLETON
const hybridStorage = new HybridStorage();

// Log storage type being used
console.log("🔍 STORAGE TYPE:", hybridStorage.getStorageType());
console.log("🔍 STORAGE INFO:", hybridStorage.getStorageInfo());

// Extract project reference from URL for consistent storage key
const projectRef = supabaseUrl.split("//")[1]?.split(".")[0] || "default";
const storageKey = `sb-${projectRef}-auth-token`;

console.log("🔍 STORAGE KEY:", storageKey);

// ✅ SINGLETON SUPABASE CLIENT - Only created once
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: hybridStorage, // Use hybrid storage that works in all environments
    storageKey: storageKey, // Consistent storage key across all tabs/clients
    detectSessionInUrl: true,
    debug: false, // Disable debug to reduce noise
  },
});

// Log the final configuration
console.log("🔍 SUPABASE CLIENT CONFIG:", {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  persistSession: true,
  autoRefreshToken: true,
  storageType: hybridStorage.getStorageType(),
  storageKey: storageKey,
  debug: false,
});

// Export storage info for debugging
export const getStorageInfo = () => hybridStorage.getStorageInfo();
export const refreshStorageDetection = () =>
  hybridStorage.refreshStorageDetection();

// ✅ UTILITY FUNCTION: Wait for session to be available
export const waitForSession = async (
  maxAttempts: number = 10,
  delayMs: number = 250,
): Promise<unknown> => {
  console.log("⏳ Waiting for session to be available...");

  let attempts = 0;

  while (attempts < maxAttempts) {
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData.session?.access_token) {
      console.log(`✅ Session available after ${attempts + 1} attempts`);
      return sessionData.session;
    }

    attempts++;
    console.log(
      `⏳ Session not ready, attempt ${attempts}/${maxAttempts}, waiting ${delayMs}ms...`,
    );

    if (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  console.error(`❌ Session still unavailable after ${maxAttempts} attempts`);
  throw new Error(`Session still unavailable after ${maxAttempts} retries`);
};

// ✅ UTILITY FUNCTION: Safe profile fetch without problematic headers
export const fetchProfile = async (userId: string, retries: number = 3) => {
  console.log(`🔍 Fetching profile for user: ${userId}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log(`📋 Profile fetch attempt ${attempt} result:`, {
        data,
        error,
      });

      if (error) {
        if (error.code === "PGRST116") {
          console.log(
            `⚠️ Profile not found for user: ${userId} (attempt ${attempt}/${retries})`,
          );
          if (attempt === retries) {
            return { data: null, error };
          }
          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        } else {
          console.error(
            `❌ Error fetching user profile (attempt ${attempt}):`,
            error,
          );
          return { data: null, error };
        }
      }

      if (data) {
        console.log("✅ Profile found:", data);
        return { data, error: null };
      }
    } catch (err) {
      console.error(
        `💥 Exception during profile fetch (attempt ${attempt}):`,
        err,
      );
      if (attempt === retries) {
        return { data: null, error: err };
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return { data: null, error: new Error("Max retries exceeded") };
};
