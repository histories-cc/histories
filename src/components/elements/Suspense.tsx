import React from 'react';

interface ISupenseProps {
  fallback?: React.ReactNode | React.ReactNode[];
  children: React.ReactNode | React.ReactNode[];
  condition: boolean;
}

const Suspense: React.FC<ISupenseProps> = ({
  fallback,
  children,
  condition,
}) => {
  return <>{condition ? children : fallback || null}</>;
};

export default Suspense;
