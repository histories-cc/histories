const MarkerIcon: React.FC<{
  stroke?: string;
  fill?: string;
  className?: string;
}> = ({ stroke, className, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ?? ''}
      viewBox="0 0 24 24"
      stroke={stroke ?? ''}
      className={className ?? ''}
    >
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default MarkerIcon;
