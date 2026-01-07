import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export const CampaignCardSkeleton = () => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Skeleton className="h-48 sm:h-56 w-full rounded-none" />
      
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-2 gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>

      <CardContent className="pb-3 px-4 sm:px-6 flex-grow">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <Skeleton className="w-full h-2 sm:h-2.5 rounded-full" />

          <div className="flex justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 sm:px-6">
        <Skeleton className="w-full h-10" />
      </CardFooter>
    </Card>
  );
};
