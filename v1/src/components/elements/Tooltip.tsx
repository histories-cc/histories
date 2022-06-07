import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

export type TooltipProps = { text: string };

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  let timer: NodeJS.Timer;

  return (
    <div
      className="relative cursor-pointer"
      onMouseLeave={() => {
        clearTimeout(timer);
        setExpanded(false);
      }}
      onMouseEnter={() => {
        timer = setTimeout(() => setExpanded(true), 500);
      }}
    >
      <div>{children}</div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 flex flex-col px-2 mt-2 text-xs font-bold text-gray-100 bg-gray-900 border border-gray-800 rounded-lg -translate-y-full -top-3 transform-gpu -translate-x-1/4 left-1/2 py-0.5 truncated whitespace-nowrap"
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
