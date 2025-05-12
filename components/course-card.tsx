// ...existing imports...
import Link from 'next/link';
import { BookOpen, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    description: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/channels/delete`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channelId: course.id }),
        }
      );
      if (!res.ok) {
        throw new Error('Nie udało się usunąć kanału');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <CardTitle>
              {course.name.length > 14
                ? course.name.substring(0, 14) + '...'
                : course.name}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteMutation.mutate()}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {course.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-3">
        <div className="flex w-full items-center justify-between"></div>
      </CardFooter>
    </Card>
  );
}
