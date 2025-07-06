import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Wifi,
  WifiOff,
  Settings,
  Palette,
  Bell,
  BellOff,
  CheckCircle,
  AlertCircle,
  Share,
} from "lucide-react";

interface PWAPreferences {
  theme: "light" | "dark";
  notifications: boolean;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const NativeAppDemo: React.FC = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [preferences, setPreferences] = useState<PWAPreferences>({
    theme: "light",
    notifications: false,
  });
  const [installStep, setInstallStep] = useState<
    "ready" | "installing" | "success" | "error"
  >("ready");

  // Detect PWA installation capability
  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).navigator?.standalone ||
      document.referrer.includes("android-app://");
    setIsInstalled(isStandalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsInstallable(false);
      console.log("PWA was installed");
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check for iOS PWA capability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !isStandalone) {
      setIsInstallable(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pwaPreferences");
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to load PWA preferences:", error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPrefs: PWAPreferences) => {
    setPreferences(newPrefs);
    localStorage.setItem("pwaPreferences", JSON.stringify(newPrefs));
  };

  // Handle PWA installation
  const handleInstall = async () => {
    if (!installPrompt) return;

    setInstallStep("installing");

    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;

      if (outcome === "accepted") {
        setInstallStep("success");
        setTimeout(() => setInstallStep("ready"), 3000);
      } else {
        setInstallStep("error");
        setTimeout(() => setInstallStep("ready"), 3000);
      }
    } catch (error) {
      console.error("Installation failed:", error);
      setInstallStep("error");
      setTimeout(() => setInstallStep("ready"), 3000);
    }
  };

  // Get iOS installation instructions
  const getIOSInstructions = () => [
    "Tap the Share button at the bottom of the screen",
    'Scroll down and tap "Add to Home Screen"',
    'Tap "Add" to install MaxVue as a native app',
    "The app will appear on your home screen",
  ];

  // Check offline capabilities
  const testOfflineCapabilities = () => {
    const serviceWorkerSupported = "serviceWorker" in navigator;
    const cacheStorageSupported = "caches" in window;
    const indexedDBSupported = "indexedDB" in window;

    return {
      serviceWorkerSupported,
      cacheStorageSupported,
      indexedDBSupported,
      offlineCapable: serviceWorkerSupported && cacheStorageSupported,
    };
  };

  const offlineCapabilities = testOfflineCapabilities();
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Native App (PWA) Features</h3>

      <div className="space-y-6">
        {/* Installation Status */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Installation Status
          </h4>

          {isInstalled ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                <div>
                  <p className="font-medium">App Installed!</p>
                  <p className="text-sm mt-1">
                    MaxVue is running as a native app with full offline
                    capabilities.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Install MaxVue as a native app for the best experience with
                  offline access and vision correction settings that persist.
                </p>
              </div>

              {/* Web Install Button */}
              {isInstallable && !isIOS && installPrompt && (
                <button
                  onClick={handleInstall}
                  disabled={installStep === "installing"}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {installStep === "installing"
                      ? "Installing..."
                      : "Install MaxVue App"}
                  </span>
                </button>
              )}

              {/* Fallback Instructions for Desktop Browsers */}
              {!isIOS && !installPrompt && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Manual Installation Instructions
                  </h5>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      The automatic install prompt is not available, but you can
                      still install MaxVue:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        <strong>Chrome:</strong> Look for the install icon (⬇️)
                        in the address bar, or use the three dots menu →
                        "Install MaxVue..."
                      </li>
                      <li>
                        <strong>Edge:</strong> Click the three dots menu →
                        "Apps" → "Install this site as an app"
                      </li>
                      <li>
                        <strong>Firefox:</strong> Click the three lines menu →
                        "Install this site as an app"
                      </li>
                      <li>
                        <strong>Safari:</strong> This may not support PWA
                        installation, but you can bookmark this page
                      </li>
                    </ul>
                    <p className="mt-2 text-blue-600 font-medium">
                      📌 Tip: Try refreshing the page or using a different
                      browser if the install option doesn't appear.
                    </p>
                  </div>
                </div>
              )}

              {/* iOS Instructions */}
              {isIOS && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Share className="w-4 h-4 mr-2" />
                    iOS Installation Instructions
                  </h5>
                  <ol className="text-sm text-gray-700 space-y-1">
                    {getIOSInstructions().map((instruction, index) => (
                      <li key={index}>
                        {index + 1}. {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Installation Status Messages */}
              {installStep === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-medium">Installation Successful!</p>
                  </div>
                </div>
              )}

              {installStep === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">
                      Installation cancelled or failed
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Offline Capabilities */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            {isOnline ? (
              <Wifi className="w-5 h-5 mr-2" />
            ) : (
              <WifiOff className="w-5 h-5 mr-2" />
            )}
            Offline Capabilities
          </h4>

          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border ${isOnline ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}
            >
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-orange-600" />
                )}
                <p
                  className={`font-medium ${isOnline ? "text-green-800" : "text-orange-800"}`}
                >
                  {isOnline ? "Online" : "Offline Mode"}
                </p>
              </div>
              <p
                className={`text-sm mt-1 ${isOnline ? "text-green-700" : "text-orange-700"}`}
              >
                {isOnline
                  ? "Full functionality available with real-time updates"
                  : "Core vision correction features still work offline"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">Offline Features</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Vision correction processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Calibration settings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Demo content viewing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Camera vision testing
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">
                  Technology Support
                </h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center">
                    {offlineCapabilities.serviceWorkerSupported ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    Service Worker
                  </li>
                  <li className="flex items-center">
                    {offlineCapabilities.cacheStorageSupported ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    Cache Storage
                  </li>
                  <li className="flex items-center">
                    {offlineCapabilities.indexedDBSupported ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    IndexedDB
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            App Preferences
          </h4>

          <div className="space-y-4">
            {/* Theme Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Theme</p>
                  <p className="text-sm text-gray-600">
                    Choose your preferred app theme
                  </p>
                </div>
              </div>
              <select
                value={preferences.theme}
                onChange={(e) =>
                  savePreferences({
                    ...preferences,
                    theme: e.target.value as "light" | "dark",
                  })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Notifications Setting */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {preferences.notifications ? (
                  <Bell className="w-5 h-5 text-gray-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <p className="font-medium text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-600">
                    Get reminders for vision breaks
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  savePreferences({
                    ...preferences,
                    notifications: !preferences.notifications,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.notifications ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.notifications
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Vision Settings Persistence */}
        <div className="bg-white rounded-lg shadow-md border p-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Vision Settings Persistence
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Calibration Value:</span>
              <span className="font-medium">
                +
                {parseFloat(
                  localStorage.getItem("calibrationValue") || "0",
                ).toFixed(2)}
                D
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Vision Correction:</span>
              <span className="font-medium">
                {localStorage.getItem("visionCorrectionEnabled") === "true"
                  ? "Enabled"
                  : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Theme Preference:</span>
              <span className="font-medium capitalize">
                {preferences.theme}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Notifications:</span>
              <span className="font-medium">
                {preferences.notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💾 All your vision correction settings and app preferences are
              saved locally and persist across app launches, even when offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NativeAppDemo;
