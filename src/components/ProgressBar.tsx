import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';

interface ProgressBarProps {
  /**
   * The current progress value (0-100)
   */
  value: number;
  /**
   * Optional color theme for the progress bar
   */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /**
   * Whether to show the percentage text
   */
  showPercentage?: boolean;
  /**
   * Optional label for the progress bar
   */
  label?: string;
  /**
   * Whether the progress is indeterminate
   */
  indeterminate?: boolean;
  /**
   * Optional description for screen readers
   */
  ariaLabel?: string;
  /**
   * Optional custom class names
   */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value: initialValue,
  variant = 'default',
  showPercentage = true,
  label,
  indeterminate = false,
  ariaLabel,
  className = ''
}) => {
  const [value, setValue] = useState(0);
  const controls = useAnimation();

  // Clamp value between 0 and 100
  const normalizedValue = Math.min(Math.max(initialValue, 0), 100);

  // Color variants
  const variantStyles = {
    default: {
      bar: 'bg-purple-500',
      text: 'text-purple-500',
      background: 'bg-purple-500/20'
    },
    success: {
      bar: 'bg-green-500',
      text: 'text-green-500',
      background: 'bg-green-500/20'
    },
    warning: {
      bar: 'bg-yellow-500',
      text: 'text-yellow-500',
      background: 'bg-yellow-500/20'
    },
    error: {
      bar: 'bg-red-500',
      text: 'text-red-500',
      background: 'bg-red-500/20'
    }
  };

  useEffect(() => {
    // Animate to the new value
    setValue(normalizedValue);
    controls.start({
      width: `${normalizedValue}%`,
      transition: { 
        type: 'spring',
        stiffness: 50,
        damping: 10
      }
    });
  }, [normalizedValue, controls]);

  return (
    <div 
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : normalizedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || label}
    >
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-200">{label}</span>
          {showPercentage && !indeterminate && (
            <span className={`text-sm font-medium ${variantStyles[variant].text}`}>
              {normalizedValue}%
            </span>
          )}
        </div>
      )}

      <div 
        className={`h-2 w-full rounded-full overflow-hidden ${variantStyles[variant].background}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          className={`h-full rounded-full ${variantStyles[variant].bar} ${
            indeterminate ? 'animate-indeterminate' : ''
          }`}
        />
      </div>

      {/* Status Icons */}
      {!indeterminate && value === 100 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-2 flex items-center gap-2 text-green-500"
        >
          <Check className="w-4 h-4" />
          <span className="text-sm">Complete</span>
        </motion.div>
      )}
      {!indeterminate && value < 100 && value > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 flex items-center gap-2 text-gray-400"
        >
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">In Progress</span>
        </motion.div>
      )}
    </div>
  );
};