export default function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative w-20 h-20">
        {/* Outer spinning ring - slower */}
        <div className="absolute inset-0 border-4 border-[#E8D5FF] rounded-full"></div>
        {/* Middle spinning ring - medium speed */}
        <div className="absolute inset-1 border-4 border-transparent border-t-[#C8E5FF] rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        {/* Inner spinning ring - faster */}
        <div className="absolute inset-2 border-4 border-transparent border-r-[#D4B3FF] rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
        {/* Center pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-br from-[#D4B3FF] to-[#A8E6CF] rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>
      {message && (
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-[#5A5A5A]">
            {message}
          </p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-[#D4B3FF] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-[#C8E5FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-[#C8F7E5] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
