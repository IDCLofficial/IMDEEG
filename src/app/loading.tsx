export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F7F9FA]">
      <div className="flex flex-col items-center gap-3">
        <span className="inline-block h-10 w-10 border-4 border-gray-300 border-t-primary-green rounded-full animate-spin" aria-label="Loading" />
        <p className="text-sm text-gray-600">Loading content…</p>
      </div>
    </div>
  );
}
