import { cn } from "@/lib/utils";

const CollegeLogo = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-auto w-8",
    md: "h-auto w-12",
    lg: "h-auto w-[300px]",
  };

  return (
    <div className={cn("relative overflow-hidden", sizeClasses[size], className)}>
      <img 
        src="/college-logo.svg" // File should be in the `public` folder
        alt="SSCET Logo"
        className="h-full w-full"
      />
    </div>
  );
};

export default CollegeLogo;