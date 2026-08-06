

export default function Loading() {
  return (
    <>
     

      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-orange-200"></div>

            <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-orange-600 border-t-transparent animate-spin"></div>
          </div>

          <h2 className="mt-8 text-2xl font-bold text-gray-800">
            Loading...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we prepare everything.
          </p>

          <div className="flex gap-2 mt-6">
            <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></span>
            <span
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>
      </div>
    </>
  );
}