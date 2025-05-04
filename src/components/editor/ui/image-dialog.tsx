import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Editor } from '@tiptap/core';
import React, { useState } from 'react';

export const ImageDialog = ({
  children,
  editor,
}: {
  children: React.ReactNode;
  editor: Editor;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Input
          type="url"
          value={url}
          onChange={(e) => {
            const url = e.target.value;
            setUrl(url);
          }}
        />

        {/* Buttons */}
        <div>
          <Button variant={'outline'} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={'outline'}
            onClick={() => {
              if (url) {
                editor.chain().focus().setImage({ src: url, alt: url }).run();
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
