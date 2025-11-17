import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon,
  required = false,
  className,
  wrapperClassName,
  type = 'text',
  ...props
}, ref) => {
  const inputId = props.id || props.name;
  
  return (
    <div className={cn('space-y-1', wrapperClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'block w-full px-3 py-2 border rounded-lg text-sm',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'placeholder-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed',
            'transition duration-200',
            {
              'pl-10': icon,
              'border-gray-300 focus:ring-primary-500 focus:border-primary-500': !error,
              'border-red-500 focus:ring-red-500 focus:border-red-500': error,
            },
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <p
          id={`${inputId}-error`}
          className={cn(
            'text-xs mt-1',
            error ? 'text-red-500' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;