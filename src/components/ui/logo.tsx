export default function Logo({ className }: { className?: string }) {
  return (
    <div className="w-fit flex items-center gap-1 border p-1 rounded-md">
      <span className="text-2xl font-bold text-blue-600">SEO</span>
      <span className="text-2xl font-bold bg-orange-500 text-white px-2 rounded">
        Infozy
      </span>
    </div>
  );
}
