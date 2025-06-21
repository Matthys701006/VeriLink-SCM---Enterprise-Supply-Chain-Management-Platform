import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  X, 
  Maximize, 
  Minimize,
  Contrast,
  Keyboard
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { enhancedUser, updateUserAccessibilitySettings } = useOrchestrix();
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowStimulusMode, setLowStimulusMode] = useState(
    enhancedUser?.accessibility_settings?.low_stimulus_mode || false
  );
  const [screenReaderMode, setScreenReaderMode] = useState(
    enhancedUser?.accessibility_settings?.screen_reader || false
  );
  
  // Load settings from user preferences
  useEffect(() => {
    if (enhancedUser?.accessibility_settings) {
      setHighContrast(enhancedUser.accessibility_settings.high_contrast || false);
      setLowStimulusMode(enhancedUser.accessibility_settings.low_stimulus_mode || false);
      setScreenReaderMode(enhancedUser.accessibility_settings.screen_reader || false);
    }
    
    // Check for system preferences
    if (window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    
    // Get stored font scale preference
    const storedFontScale = localStorage.getItem('fontScale');
    if (storedFontScale) {
      setFontScale(parseFloat(storedFontScale));
      applyFontScale(parseFloat(storedFontScale));
    }
  }, [enhancedUser]);
  
  const applyFontScale = (scale: number) => {
    document.documentElement.style.fontSize = `${scale * 100}%`;
    localStorage.setItem('fontScale', scale.toString());
  };
  
  const increaseFontSize = () => {
    const newScale = Math.min(fontScale + 0.1, 1.5);
    setFontScale(newScale);
    applyFontScale(newScale);
  };
  
  const decreaseFontSize = () => {
    const newScale = Math.max(fontScale - 0.1, 0.8);
    setFontScale(newScale);
    applyFontScale(newScale);
  };
  
  const resetFontSize = () => {
    setFontScale(1);
    applyFontScale(1);
  };
  
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (newValue) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    
    saveAccessibilitySettings('high_contrast', newValue);
  };
  
  const toggleLowStimulusMode = () => {
    const newValue = !lowStimulusMode;
    setLowStimulusMode(newValue);
    
    if (newValue) {
      document.body.classList.add('low-stimulus-mode');
    } else {
      document.body.classList.remove('low-stimulus-mode');
    }
    
    saveAccessibilitySettings('low_stimulus_mode', newValue);
  };
  
  const toggleScreenReaderMode = () => {
    const newValue = !screenReaderMode;
    setScreenReaderMode(newValue);
    
    saveAccessibilitySettings('screen_reader', newValue);
  };
  
  const saveAccessibilitySettings = (setting: string, value: boolean) => {
    if (enhancedUser && updateUserAccessibilitySettings) {
      const updatedSettings = {
        ...(enhancedUser.accessibility_settings || {}),
        [setting]: value
      };
      
      updateUserAccessibilitySettings(updatedSettings);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" role="dialog" aria-modal="true" aria-labelledby="accessibility-title">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      
      <div className="relative bg-white shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
          <h2 id="accessibility-title" className="text-lg font-medium">Accessibility Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close panel"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-64px)] space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Text Size</h3>
            <div className="flex items-center justify-between">
              <button 
                onClick={decreaseFontSize}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
                aria-label="Decrease font size"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <div className="flex items-center">
                <Type className="w-4 h-4 mr-1" />
                <span className="text-gray-700">{Math.round(fontScale * 100)}%</span>
              </div>
              
              <button 
                onClick={increaseFontSize}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100"
                aria-label="Increase font size"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
            
            <button 
              onClick={resetFontSize}
              className="mt-2 w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              aria-label="Reset font size"
            >
              Reset to Default
            </button>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 mb-1">Display Options</h3>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Contrast className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-gray-800">High Contrast Mode</span>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                <input 
                  type="checkbox"
                  id="highContrastToggle"
                  className="absolute w-0 h-0 opacity-0"
                  checked={highContrast}
                  onChange={toggleHighContrast}
                  aria-label="Toggle high contrast mode"
                />
                <label
                  htmlFor="highContrastToggle"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ${
                    highContrast ? 'bg-blue-600' : ''
                  }`}
                >
                  <span
                    className={`absolute block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      highContrast ? 'translate-x-6' : 'translate-x-0.5'
                    } top-0.5`}
                  ></span>
                </label>
              </div>
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Moon className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-gray-800">Low Stimulus Mode</span>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                <input 
                  type="checkbox"
                  id="lowStimulusToggle"
                  className="absolute w-0 h-0 opacity-0"
                  checked={lowStimulusMode}
                  onChange={toggleLowStimulusMode}
                  aria-label="Toggle low stimulus mode"
                />
                <label
                  htmlFor="lowStimulusToggle"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ${
                    lowStimulusMode ? 'bg-blue-600' : ''
                  }`}
                >
                  <span
                    className={`absolute block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      lowStimulusMode ? 'translate-x-6' : 'translate-x-0.5'
                    } top-0.5`}
                  ></span>
                </label>
              </div>
            </label>
            
            <label className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Keyboard className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-gray-800">Screen Reader Optimized</span>
              </div>
              <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                <input 
                  type="checkbox"
                  id="screenReaderToggle"
                  className="absolute w-0 h-0 opacity-0"
                  checked={screenReaderMode}
                  onChange={toggleScreenReaderMode}
                  aria-label="Toggle screen reader optimization"
                />
                <label
                  htmlFor="screenReaderToggle"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ${
                    screenReaderMode ? 'bg-blue-600' : ''
                  }`}
                >
                  <span
                    className={`absolute block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      screenReaderMode ? 'translate-x-6' : 'translate-x-0.5'
                    } top-0.5`}
                  ></span>
                </label>
              </div>
            </label>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Motion Sensitivity</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-gray-800">Reduced Motion</span>
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">System Setting</span>
              </div>
              <span className={reducedMotion ? 'text-green-600' : 'text-gray-500'}>
                {reducedMotion ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              This setting is controlled by your system preferences.
              {!reducedMotion && " To enable, check your operating system's accessibility settings."}
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-700">Dashboard</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Alt + D</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-700">Search</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Alt + S</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-700">Help</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Alt + H</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-700">Notifications</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Alt + N</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-700">Profile</span>
                <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs">Alt + P</kbd>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Your accessibility settings are automatically saved and will be applied across all your devices when you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;