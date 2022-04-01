import React from 'react';

import { Loading } from '..';

export type Styles =
  | 'primary_solid'
  | 'transparent'
  | 'transparent_secondary'
  | 'warning_solid'
  | 'danger_solid'
  | 'success_solid'
  | 'primary_outline'
  | 'warning_outline'
  | 'danger_outline'
  | 'success_outline';

type Sizes = 'sm' | 'base' | 'md' | 'lg' | 'xl';

export type ButtonProps = {
  loading?: boolean;
  style?: Styles;
  size?: Sizes;
  args?: any;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset' | 'link';
};

export const ButtonStyles = {
  primary_solid:
    'bg-brand hover:bg-brand border border-brand text-white text-center flex items-center justify-center font-semibold',
  transparent:
    'bg-transparent text-erie text-center flex items-center justify-center font-semibold',
  transparent_secondary:
    'bg-transparent text-subtle text-center flex items-center justify-center font-semibold',
  warning_solid:
    'bg-orange-500 hover:bg-orange-600 border border-orange-600 text-white focus:ring-orange-600',
  danger_solid:
    'bg-red-500 hover:bg-red-600 border border-red-600 text-white focus:ring-red-400',
  success_solid:
    'bg-green-500 hover:bg-green-600 border border-green-600 text-white focus:ring-green-400',
  primary_outline:
    'border border-gray-900 text-gray-900 hover:bg-gray-100 focus:ring-gray-400',
  warning_outline:
    'border border-orange-500 text-orange-500 hover:bg-orange-100 focus:ring-orange-400',
  danger_outline:
    'border border-red-500 text-red-500 hover:bg-red-100 focus:ring-red-400',
  success_outline:
    'border border-green-500 text-green-500 hover:bg-green-100 focus:ring-green-400',
};

export const ButtonSizes = {
  sm: 'px-2 py-1 gap-1',
  base: 'px-4 h-14 gap-2',
  md: 'px-6 py-3 gap-2',
  lg: 'px-8 py-4 gap-2',
  xl: 'px-10 py-5 gap-2',
};

const Button: React.FC<ButtonProps> = ({
  loading,
  style,
  size,
  args,
  children,
  className,
  onClick,
  type,
}) => (
  <button
    {...args}
    onClick={onClick}
    type={loading ? 'button' : type || 'submit'}
    className={
      'flex items-center transition-all duration-300 ease-in-out rounded-lg uppercase ' +
        ButtonStyles[style ?? 'primary_solid'] +
        ' ' +
        ButtonSizes[size ?? 'base'] +
        ' ' +
        className ?? ''
    }
  >
    {loading ? <Loading size="base" /> : children}
  </button>
);

export default Button;
