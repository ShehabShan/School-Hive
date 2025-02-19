import { AlertCircle } from "lucide-react";

export default function DataNotAvailable() {
  const handleRetry = () => {
    // Implement your retry logic here
    console.log("Retrying to fetch data...");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Data Not Available
        </h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but the requested data is currently not available. This
          could be due to a temporary issue or network problem.
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
