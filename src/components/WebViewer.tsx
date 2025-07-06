import React, { useState } from "react";
import { Globe, RefreshCw, AlertTriangle } from "lucide-react";
import VisionCorrectedContent from "./VisionCorrectedContent";

interface WebViewerProps {
  url?: string;
  className?: string;
}

const WebViewer: React.FC<WebViewerProps> = ({
  url = "https://example.com",
  className = "",
}) => {
  const [inputUrl, setInputUrl] = useState(url);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const normalizeUrl = (inputUrl: string): string => {
    let normalizedUrl = inputUrl.trim();

    // If it doesn't start with http:// or https://, add https://
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    return normalizedUrl;
  };

  const handleUrlSubmit = (url: string) => {
    if (!url.trim()) return;

    const finalUrl = normalizeUrl(url);
    console.log("🌐 Loading URL:", finalUrl);

    setIsLoading(true);
    setHasError(false);
    setCurrentUrl(finalUrl);

    // Reset loading state after a short delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit(inputUrl);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);

    // Force iframe reload by updating the src
    const iframe = document.querySelector(
      "#web-viewer-iframe",
    ) as HTMLIFrameElement;
    if (iframe) {
      const currentSrc = iframe.src;
      iframe.src = currentSrc;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleIframeError = () => {
    console.warn("🚫 Failed to load URL:", currentUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    console.log("✅ Successfully loaded URL:", currentUrl);
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Browser Controls */}
      <div className="bg-gray-100 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh page"
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>

          <div className="flex-1 flex items-center bg-white rounded-lg px-3 py-2 border border-gray-300">
            <Globe className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-sm text-gray-700 bg-transparent outline-none"
              placeholder="Enter URL (e.g., www.nytimes.com)"
            />
          </div>

          <button
            onClick={() => handleUrlSubmit(inputUrl)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Go
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-2 flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isLoading
                ? "bg-yellow-500"
                : hasError
                  ? "bg-red-500"
                  : "bg-green-500"
            }`}
          ></div>
          <span className="text-xs text-gray-600">
            {isLoading ? "Loading..." : hasError ? "Failed to load" : "Ready"}
          </span>
        </div>
      </div>

      {/* Web Content with Vision Correction */}
      <VisionCorrectedContent className="h-96 overflow-hidden relative">
        {hasError ? (
          // Error state
          <div className="h-full bg-red-50 flex items-center justify-center p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Failed to Load
              </h3>
              <p className="text-red-600 mb-4">
                Unable to load{" "}
                <span className="font-mono text-sm">{currentUrl}</span>
              </p>
              <p className="text-sm text-red-500 mb-4">This may be due to:</p>
              <ul className="text-xs text-red-500 text-left space-y-1 mb-4">
                <li>• X-Frame-Options blocking iframe embedding</li>
                <li>• HTTPS/SSL certificate issues</li>
                <li>• Network connectivity problems</li>
                <li>• Invalid URL format</li>
              </ul>
              <button
                onClick={() => handleUrlSubmit("https://example.com")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Load Example.com
              </button>
            </div>
          </div>
        ) : (
          // Iframe content
          <iframe
            id="web-viewer-iframe"
            src={currentUrl}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Web Viewer"
          />
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Loading {currentUrl}...</p>
            </div>
          </div>
        )}
      </VisionCorrectedContent>

      {/* URL Info */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 truncate">
          Currently viewing: <span className="font-mono">{currentUrl}</span>
        </p>
      </div>
    </div>
  );
};

export default WebViewer;
