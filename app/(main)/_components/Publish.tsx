'use client';

import { Doc } from '@/convex/_generated/dataModel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UseOrigin } from '@/hooks/use-origin';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ClipboardIcon, GlobeIcon } from 'lucide-react';

interface PublishProps {
  initialData: Doc<'documents'>;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = UseOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({ id: initialData._id, isPublished: true }).finally(
      () => setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Successfully published!',
      error: 'Something went wrong',
    });
  };

  const onUnPublish = () => {
    setIsSubmitting(true);

    const promise = update({ id: initialData._id, isPublished: false }).finally(
      () => setIsSubmitting(false)
    );

    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Successfully unpublished!',
      error: 'Something went wrong',
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <GlobeIcon className="w-4 h-4 text-sky-500" />
          )}
        </Button>
        <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
          {initialData.isPublished ? (
            <div>Published</div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <GlobeIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-2">Publish this note</p>
              <span className="text-xs text-muted-foreground mb-4">
                Share your work with others
              </span>
              <Button
                size="sm"
                disabled={isSubmitting}
                onClick={onPublish}
                className="w-full text-xs"
              >
                Publish
              </Button>
            </div>
          )}
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  );
};
