import React, { useState, useEffect } from 'react';
import { useConfigStore } from '@/app/store/configStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const configStore = useConfigStore(state => ({
    hungerDecayRate: state.hungerDecayRate,
    energyDecayRate: state.energyDecayRate,
    boredomDecayRate: state.boredomDecayRate,
    affectionDecayRate: state.affectionDecayRate,
    hungerThreshold: state.hungerThreshold,
    energyThreshold: state.energyThreshold,
    boredomThreshold: state.boredomThreshold,
    affectionThreshold: state.affectionThreshold,
    notificationsEnabled: state.notificationsEnabled,
    soundsEnabled: state.soundsEnabled,
    feedingReminderFrequency: state.feedingReminderFrequency,
    feedingReminderHours: state.feedingReminderHours,
    setDecayRates: state.setDecayRates,
    setThresholds: state.setThresholds,
    setNotificationSettings: state.setNotificationSettings
  }));
  
  // Local state for form values
  const [decayRates, setDecayRates] = useState({
    hunger: configStore.hungerDecayRate,
    energy: configStore.energyDecayRate,
    boredom: configStore.boredomDecayRate,
    affection: configStore.affectionDecayRate
  });
  
  const [thresholds, setThresholds] = useState({
    hunger: configStore.hungerThreshold,
    energy: configStore.energyThreshold,
    boredom: configStore.boredomThreshold,
    affection: configStore.affectionThreshold
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: configStore.notificationsEnabled,
    sounds: configStore.soundsEnabled,
    feedingFrequency: configStore.feedingReminderFrequency,
    feedingHours: configStore.feedingReminderHours
  });
  
  // Update local state when store changes or component loads
  useEffect(() => {
    setDecayRates({
      hunger: configStore.hungerDecayRate,
      energy: configStore.energyDecayRate,
      boredom: configStore.boredomDecayRate,
      affection: configStore.affectionDecayRate
    });
    
    setThresholds({
      hunger: configStore.hungerThreshold,
      energy: configStore.energyThreshold,
      boredom: configStore.boredomThreshold,
      affection: configStore.affectionThreshold
    });
    
    setNotificationSettings({
      enabled: configStore.notificationsEnabled,
      sounds: configStore.soundsEnabled,
      feedingFrequency: configStore.feedingReminderFrequency,
      feedingHours: configStore.feedingReminderHours
    });
  }, [
    configStore.hungerDecayRate,
    configStore.energyDecayRate,
    configStore.boredomDecayRate,
    configStore.affectionDecayRate,
    configStore.hungerThreshold,
    configStore.energyThreshold,
    configStore.boredomThreshold,
    configStore.affectionThreshold,
    configStore.notificationsEnabled,
    configStore.soundsEnabled,
    configStore.feedingReminderFrequency,
    configStore.feedingReminderHours
  ]);
  
  // Handle decay rate changes
  const handleDecayRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDecayRates(prev => ({ 
      ...prev, 
      [name]: parseFloat(value) 
    }));
  };
  
  // Handle threshold changes
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setThresholds(prev => ({ 
      ...prev, 
      [name]: parseInt(value, 10)
    }));
  };
  
  // Handle notification setting changes
  const handleNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({ 
      ...prev, 
      [name]: checked 
    }));
  };
  
  // Handle feeding frequency change
  const handleFeedingFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'twice-daily' | 'daily' | 'custom';
    setNotificationSettings(prev => ({ 
      ...prev, 
      feedingFrequency: value
    }));
  };
  
  // Save all settings
  const handleSaveSettings = () => {
    // Save decay rates
    configStore.setDecayRates(decayRates);
    
    // Save thresholds
    configStore.setThresholds(thresholds);
    
    // Save notification settings
    configStore.setNotificationSettings({
      enabled: notificationSettings.enabled,
      sounds: notificationSettings.sounds,
      feedingFrequency: notificationSettings.feedingFrequency,
      feedingHours: notificationSettings.feedingHours
    });
    
    // Close the panel
    onClose();
  };
  
  // Reset all settings to defaults
  const handleResetSettings = () => {
    setDecayRates({
      hunger: 1.0,
      energy: 1.0,
      boredom: 1.0,
      affection: 1.0
    });
    
    setThresholds({
      hunger: 20,
      energy: 15,
      boredom: 80,
      affection: 20
    });
    
    setNotificationSettings({
      enabled: true,
      sounds: true,
      feedingFrequency: 'twice-daily',
      feedingHours: [8, 20]
    });
  };
  
  // If the panel is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        
        {/* Settings form */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Decay Rates Section */}
            <div>
              <h4 className="text-md font-medium mb-2">Decay Rates</h4>
              <p className="text-sm text-gray-500 mb-3">
                Control how quickly your mammoth's needs change over time.
                Higher values mean faster decay (more challenging).
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Hunger Decay: {decayRates.hunger.toFixed(1)}x</span>
                    <input
                      type="range"
                      name="hunger"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={decayRates.hunger}
                      onChange={handleDecayRateChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Energy Decay: {decayRates.energy.toFixed(1)}x</span>
                    <input
                      type="range"
                      name="energy"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={decayRates.energy}
                      onChange={handleDecayRateChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Boredom Increase: {decayRates.boredom.toFixed(1)}x</span>
                    <input
                      type="range"
                      name="boredom"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={decayRates.boredom}
                      onChange={handleDecayRateChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Affection Decay: {decayRates.affection.toFixed(1)}x</span>
                    <input
                      type="range"
                      name="affection"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={decayRates.affection}
                      onChange={handleDecayRateChange}
                      className="w-48"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Notification Thresholds */}
            <div>
              <h4 className="text-md font-medium mb-2">Notification Thresholds</h4>
              <p className="text-sm text-gray-500 mb-3">
                Set when your mammoth will notify you about its needs.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Hunger Alert Threshold: {thresholds.hunger}</span>
                    <input
                      type="range"
                      name="hunger"
                      min="5"
                      max="40"
                      step="5"
                      value={thresholds.hunger}
                      onChange={handleThresholdChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Energy Alert Threshold: {thresholds.energy}</span>
                    <input
                      type="range"
                      name="energy"
                      min="5"
                      max="40"
                      step="5"
                      value={thresholds.energy}
                      onChange={handleThresholdChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Boredom Alert Threshold: {thresholds.boredom}</span>
                    <input
                      type="range"
                      name="boredom"
                      min="60"
                      max="95"
                      step="5"
                      value={thresholds.boredom}
                      onChange={handleThresholdChange}
                      className="w-48"
                    />
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Affection Alert Threshold: {thresholds.affection}</span>
                    <input
                      type="range"
                      name="affection"
                      min="5"
                      max="40"
                      step="5"
                      value={thresholds.affection}
                      onChange={handleThresholdChange}
                      className="w-48"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div>
              <h4 className="text-md font-medium mb-2">Notification Settings</h4>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications-enabled"
                    name="enabled"
                    checked={notificationSettings.enabled}
                    onChange={handleNotificationToggle}
                    className="mr-2"
                  />
                  <label htmlFor="notifications-enabled" className="text-sm">
                    Enable notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sounds-enabled"
                    name="sounds"
                    checked={notificationSettings.sounds}
                    onChange={handleNotificationToggle}
                    className="mr-2"
                  />
                  <label htmlFor="sounds-enabled" className="text-sm">
                    Enable notification sounds
                  </label>
                </div>
                
                <div>
                  <label htmlFor="feeding-frequency" className="block text-sm mb-1">
                    Feeding Reminder Frequency
                  </label>
                  <select
                    id="feeding-frequency"
                    value={notificationSettings.feedingFrequency}
                    onChange={handleFeedingFrequencyChange}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="twice-daily">Twice Daily (8 AM and 8 PM)</option>
                    <option value="daily">Once Daily (8 AM)</option>
                    <option value="custom">Custom (Not implemented yet)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="border-t p-4 flex justify-between">
          <button
            onClick={handleResetSettings}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            Reset to Defaults
          </button>
          
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 