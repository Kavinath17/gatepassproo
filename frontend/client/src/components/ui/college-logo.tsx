import React from "react";

interface CollegeLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CollegeLogo: React.FC<CollegeLogoProps> = ({ 
  size = "md", 
  className = ""
}) => {
  const sizeClass = {
    sm: "h-8 w-auto",
    md: "h-16 w-auto",
    lg: "h-24 w-auto",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`${sizeClass[size]}`}
        viewBox="0 0 150 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* College logo as SVG */}
        <circle cx="75" cy="75" r="70" fill="#1E40AF" />
        <path
          d="M75 20L115 45V105L75 130L35 105V45L75 20Z"
          fill="white"
          stroke="#1E40AF"
          strokeWidth="2"
        />
        <path
          d="M75 40L53 55V85L75 100L97 85V55L75 40Z"
          fill="#0EA5E9"
        />
        <path
          d="M47 112H103M75 20V40M35 45L53 55M97 55L115 45M97 85L115 105M53 85L35 105"
          stroke="#1E40AF"
          strokeWidth="2"
        />
        <text
          x="75"
          y="70"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="10"
          fontWeight="bold"
          fill="white"
        >
          COLLEGE
        </text>
      </svg>
    </div>
  );
};

export default CollegeLogo;
