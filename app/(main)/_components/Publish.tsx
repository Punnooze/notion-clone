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
import { CheckIcon, ClipboardIcon, CopyIcon, GlobeIcon } from 'lucide-react';

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
      <PopoverTrigger>
        <Button size="sm" variant="ghost">
          Publish
          {initialData.isPublished && (
            <GlobeIcon className="w-4 h-4 text-sky-500 ml-2" />
          )}
        </Button>
        <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
          {initialData.isPublished ? (
            <div className="space-y-4 ">
              <div className="flex items-center gap-x-2">
                <GlobeIcon className="text-sky-500 animate-pulse h-4 w-4 " />
                <p className="text-xs font-medium text-sky-500">
                  This note is live on web!
                </p>
              </div>
              <div className="flex items-center">
                <input
                  value={url}
                  className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                  disabled
                />
                <Button
                  onClick={onCopy}
                  disabled={copied}
                  className="h-8 rounded-l-none"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 " />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={onUnPublish}
                size="sm"
                className="w-full text-xs"
                disabled={isSubmitting}
              >
                Un-publish
              </Button>
            </div>
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
