import { Plan } from "@/types/enums";
import { Search } from "lucide-react";

interface RemainingSearchesProps {
  planName?: Plan;
  totalSearches: number | null | undefined;
  remainingSearches: number | null;
}

export const RemainingSearches: React.FC<RemainingSearchesProps> = ({
  totalSearches,
  remainingSearches,
}) => {
  const totalRemaining = remainingSearches ?? 0;

  // No searches left
  if (totalRemaining <= 0) {
    return (
      <div className="h-10 inline-flex items-center px-3 py-1 rounded-md bg-red-100 text-red-700 font-medium text-sm shadow-sm">
        <Search className="mr-2 h-5 w-5" /> No searches remaining
      </div>
    );
  }

  return (
    <div className="h-10 inline-flex items-center px-3 py-1 rounded-md bg-gradient-to-r from-primary/10 to-primary/20 text-primary font-medium text-sm shadow-sm">
      <Search className="mr-2 h-4 w-4" />
      {totalRemaining} searches remaining / {totalSearches} total
    </div>
  );
};
