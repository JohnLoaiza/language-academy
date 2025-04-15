import { ClipLoader } from "react-spinners";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <ClipLoader size={48} color="#3b82f6" />
    </div>
  );
};

export default LoadingSpinner;
