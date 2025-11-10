import { FiLoader } from "react-icons/fi";

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="text-center">
        <div className={`${sizeClasses[size]} mx-auto mb-4 text-primary-600 animate-spin`}>
          <FiLoader className="w-full h-full" />
        </div>
        <p className="text-secondary-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
