import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Palette, Bell, Shield, Database, HelpCircle, LucideIcon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

type SettingItem =
  | { label: string; description: string; type: 'toggle'; value: boolean; onChange: (v: boolean) => void; icon?: LucideIcon }
  | { label: string; description: string; type: 'select'; value: string; onChange: (v: string) => void; options: string[]; icon?: LucideIcon }
  | { label: string; description: string; type: 'button'; action: string; icon?: LucideIcon };

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [currency, setCurrency] = useState('INR');

  const settingsSections: { title: string; icon: React.ElementType; items: SettingItem[] }[] = [
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          type: 'toggle',
          value: theme === 'dark',
          onChange: toggleTheme,
          icon: theme === 'dark' ? Moon : Sun
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          description: 'Receive alerts for budget updates',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          label: 'Budget Alerts',
          description: 'Get notified when approaching budget limits',
          type: 'toggle',
          value: true,
          onChange: () => { }
        }
      ]
    },
    {
      title: 'Data & Privacy',
      icon: Shield,
      items: [
        {
          label: 'Account Sync',
          description: 'Sync transaction data from linked bank accounts',
          type: 'button',
          action: 'Sync Now'
        },
        {
          label: 'Auto Backup',
          description: 'Automatically backup data to cloud',
          type: 'toggle',
          value: autoBackup,
          onChange: setAutoBackup
        },
        {
          label: 'Data Export',
          description: 'Export your financial data',
          type: 'button',
          action: 'Export Data'
        }
      ]
    },
    {
      title: 'Preferences',
      icon: SettingsIcon,
      items: [
        {
          label: 'Currency',
          description: 'Set your preferred currency',
          type: 'select',
          value: currency,
          onChange: setCurrency,
          options: ['INR', 'USD', 'EUR', 'GBP']
        },
        {
          label: 'Language',
          description: 'Choose your language',
          type: 'select',
          value: 'English',
          onChange: () => { },
          options: ['English', 'Hindi', 'Spanish', 'French']
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Settings
            </h2>
            <p className="text-secondary-500 dark:text-secondary-400">
              Customize your CAFA experience
            </p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center">
              <section.icon className="w-5 h-5 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {section.title}
            </h3>
          </div>

          <div className="space-y-4">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {item.icon && (
                    <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-600 rounded-full flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {item.type === 'toggle' && (
                    <button
                      onClick={() => (item as Extract<SettingItem, { type: 'toggle' }>).onChange(!(item as Extract<SettingItem, { type: 'toggle' }>).value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(item as Extract<SettingItem, { type: 'toggle' }>).value ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(item as Extract<SettingItem, { type: 'toggle' }>).value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  )}

                  {item.type === 'select' && (
                    <select
                      value={(item as Extract<SettingItem, { type: 'select' }>).value}
                      onChange={(e) => (item as Extract<SettingItem, { type: 'select' }>).onChange(e.target.value)}
                      className="px-3 py-2 border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white text-sm focus:border-primary-500 focus:outline-none"
                    >
                      {(item as Extract<SettingItem, { type: 'select' }>).options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}

                  {item.type === 'button' && (
                    <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                      {(item as Extract<SettingItem, { type: 'button' }>).action}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Data Management
            </h3>
          </div>

          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
              <p className="font-medium text-secondary-900 dark:text-white">Clear All Data</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Remove all transactions and settings</p>
            </button>

            <button className="w-full p-3 text-left bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
              <p className="font-medium text-secondary-900 dark:text-white">Reset to Default</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Restore default categories and settings</p>
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-warning-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Support & Help
            </h3>
          </div>

          <div className="space-y-3">
            <button className="w-full p-3 text-left bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
              <p className="font-medium text-secondary-900 dark:text-white">User Guide</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Learn how to use the app</p>
            </button>

            <button className="w-full p-3 text-left bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors">
              <p className="font-medium text-secondary-900 dark:text-white">Contact Support</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Get help from our team</p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-secondary-800 rounded-2xl p-6 shadow-sm border border-secondary-200 dark:border-secondary-700 text-center"
      >
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          CAFA
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400 mb-4">
          Version 1.0.0 • Built with ❤️
        </p>
        <div className="flex items-center justify-center space-x-4 text-sm text-secondary-400 dark:text-secondary-500">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
          <span>•</span>
          <span>Open Source</span>
        </div>
      </motion.div>
    </div>
  );
}


