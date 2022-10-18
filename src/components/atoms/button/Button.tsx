import React, { ButtonHTMLAttributes, FC } from 'react';

// extends HTML button type with variant, excludes className
interface IButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

const Button: FC<IButtonProps> = ({
  variant = 'primary',
  loading,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`
      ${
        props.disabled
          ? 'opacity-60'
          : variant === 'primary'
          ? 'hover:bg-brand hover:border-brand active:bg-brand active:border-brand'
          : variant === 'secondary'
          ? 'hover:bg-gray-100 hover:border-gray-200 active:bg-gray-100 active:border-gray-300 active:text-gray-700'
          : variant === 'tertiary'
          ? 'hover:bg-gray-50 hover:border-gray-50 active:bg-gray-100 active:border-gray-100 active:text-gray-700'
          : ''
      } ${
        variant === 'primary'
          ? 'bg-brand border-brand text-white'
          : variant === 'secondary'
          ? 'bg-white border-gray-200 text-gray-600'
          : variant === 'tertiary'
          ? 'bg-white border-white text-gray-600'
          : ''
      } border px-6 py-2 w-full flex justify-center gap-[10px] rounded-[8px] font-bold leading-8 uppercase`}
      disabled={loading || props.disabled}
    >
      {children}
    </button>
  );
};

export default Button;
