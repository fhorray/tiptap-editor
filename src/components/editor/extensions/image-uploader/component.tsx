import React, { useCallback, useState } from 'react';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { Image, Upload, X, Loader2, XIcon } from 'lucide-react';
import { deleteImageFn, uploadImageFn } from '../utils';

export const ImageUploaderComponent = ({
  node,
  updateAttributes,
  deleteNode,
}: NodeViewProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleUpload(file);
    } else {
      setError('Please upload an image file');
    }
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await handleUpload(file);
      }
    },
    [],
  );

  // MAIN FUNCTION TO UPLOAD FILE
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadImageFn(file);

      updateAttributes({
        src: imageUrl,
        alt: file.name,
        title: file.name,
      });
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (url: string): Promise<boolean> => {
    console.log('Delete file logic');

    setIsUploading(true);
    setError(null);

    try {
      const result = await deleteImageFn(url);
      return result;
    } catch (error) {
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  if (node.attrs.src && !isUploading) {
    return (
      <NodeViewWrapper>
        <div className="relative group">
          <img
            src={node.attrs.src}
            alt={node.attrs.alt || ''}
            title={node.attrs.title || ''}
            className="max-w-full rounded-lg shadow-md"
          />
          <button
            type="button"
            onClick={async () => {
              const isSuccess = await handleDeleteFile('');

              if (isSuccess) {
                deleteNode();
              }
            }}
            className="absolute top-2 right-4 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Remove image"
          >
            <XIcon size={16} />
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center
          ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-700'
          }
          transition-colors duration-200
        `}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <Loader2 size={24} className="text-indigo-500 animate-spin" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                {isDragging ? <Image size={24} /> : <Upload size={24} />}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isDragging
                  ? 'Drop image here'
                  : 'Click or drag image to upload'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports: JPG, PNG, GIF
              </p>
            </>
          )}

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};
