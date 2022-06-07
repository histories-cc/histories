import FirstLetterUppercase from '@src/functions/FirstLetterUppercase';
import React from 'react';

const CheckboxElement: React.FC<{
  title: string;
  description: string;
  args?: React.HTMLProps<HTMLInputElement>;
}> = ({ title, description, args }) => {
  return (
    <label className="inline-flex pb-4">
      <input
        className="w-4 h-4 mt-1 text-green-500 border border-gray-300 mr-1.5 focus:ring-gray-400 focus:ring-opacity-25 rounded-md"
        type="checkbox"
        {...args}
      />
      <div className="flex flex-col">
        <div className="font-medium">{FirstLetterUppercase(title)}</div>
        <div>{description}</div>
      </div>
    </label>
  );
};

export default CheckboxElement;
