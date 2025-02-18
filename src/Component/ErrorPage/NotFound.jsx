const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>
        <div className="mt-8">
          <div className="inline-flex items-center justify-center w-full">
            <span className="h-12 w-12 text-indigo-600 text-4xl">📖</span>
          </div>
          <h2 className="mt-6 text-center text-xl font-semibold text-gray-900">
            Don't worry, you can still find your perfect scholarship!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Try searching for scholarships or return to our homepage.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/"
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <span className="mr-2">🏠</span> Go to Homepage
          </a>
          <a
            href="/search"
            className="flex items-center justify-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <span className="mr-2">🔍</span> Search Scholarships
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
