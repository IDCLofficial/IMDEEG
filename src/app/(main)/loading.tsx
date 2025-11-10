import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative h-16 w-16">
          <Image 
            src="/logo.png" 
            alt="Imo State Logo" 
            fill
            className="object-contain animate-pulse"
            priority
          />
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-1.5 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-green rounded-full animate-[progress_2s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm font-medium text-gray-600">Loading Digital Economy Portal</p>
        </div>
      </div>
    </div>
  );
}
