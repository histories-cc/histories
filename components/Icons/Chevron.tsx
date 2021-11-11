const ChevronIcon: React.FC<{
  stroke?: string;
  fill?: string;
  className?: string;
}> = ({ stroke, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ?? 'none'}
      viewBox="0 0 24 24"
      stroke={stroke ?? ''}
      className={className ?? ''}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
};

export default ChevronIcon;
