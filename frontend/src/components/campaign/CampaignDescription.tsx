import { Card } from "@/components/ui/card";

interface CampaignDescriptionProps {
  description: string;
}

export function CampaignDescription({ description }: CampaignDescriptionProps) {
  // Format description with line breaks and basic formatting
  const formatDescription = (text: string) => {
    return text.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Deskripsi Campaign
      </h2>
      <div className="prose prose-gray max-w-none">
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
          {formatDescription(description)}
        </div>
      </div>
    </Card>
  );
}
