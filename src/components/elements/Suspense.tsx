import React from 'react';

interface ISupenseProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  condition: boolean;
}

const Suspense: React.FC<ISupenseProps> = ({
  fallback,
  children,
  condition,
}) => {
  return <>{condition ? children : fallback}</>;
};

export default Suspense;
