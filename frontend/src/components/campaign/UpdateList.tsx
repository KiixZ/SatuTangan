import type { CampaignUpdate } from "@/types/campaign";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface UpdateListProps {
  updates: CampaignUpdate[];
}

export function UpdateList({ updates }: UpdateListProps) {
  if (updates.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Update Campaign
        </h2>
        <p className="text-gray-600 text-center py-8">
          Belum ada update untuk campaign ini.
        </p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Update Campaign</h2>
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {update.title}
                {update.is_automatic && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Otomatis
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(update.created_at)}</span>
              </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap mb-3">
              {update.description}
            </p>
            {update.photo_url && (
              <img
                src={`${API_URL}${update.photo_url}`}
                alt={update.title}
                className="rounded-lg max-w-full h-auto max-h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null; // Prevent infinite loop
                  e.currentTarget.src = "/placeholder-campaign.jpg";
                }}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
