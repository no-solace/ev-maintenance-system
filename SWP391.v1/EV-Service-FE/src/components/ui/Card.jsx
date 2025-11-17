import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({ 
  className, 
  children,
  hoverable = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
        {
          'hover:shadow-lg transition-shadow duration-300': hoverable,
          'p-6': padding,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p
      className={cn(
        'mt-1 text-sm text-gray-600',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-200 bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;