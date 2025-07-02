// src/components/FileUpload.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { signupUpload } from '@/integrations/supabase/fileUpload'; // Make sure this import is correct

interface FileUploadProps {
  label: string;
  accept: string;
  folder: 'photos' | 'dues';
  currentUrl: string;
  onUpload: (url: string) => void;
  maxSize: number; // in MB
  isSignup?: boolean;
  onError?: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  folder,
  currentUrl,
  onUpload,
  maxSize,
  isSignup = true, // Default to true for signup
  onError,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        const errorMsg = `File size exceeds ${maxSize}MB limit`;
        if (onError) onError(errorMsg);
        return;
      }

      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }

      // Start upload immediately
      handleUpload(selectedFile);
    }
  };

  const handleUpload = useCallback(async (fileToUpload: File) => {
    setIsUploading(true);
    try {
      console.log(`Uploading file for ${label} using ${isSignup ? 'signupUpload' : 'uploadFile'}`);
      
      const result = await signupUpload(fileToUpload, folder);
      
      console.log('Upload result:', result);

      if (result.url) {
        onUpload(result.url);
      } else if (result.error) {
        console.error('Upload error:', result.error);
        if (onError) onError(result.error);
      } else {
        if (onError) onError('Unknown upload error');
      }
    } catch (error) {
      console.error('Upload exception:', error);
      if (onError) onError('File upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [folder, onUpload, onError, isSignup, label]);

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {currentUrl ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm truncate">
            File uploaded: {currentUrl.split('/').pop()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemove}
            disabled={isUploading}
          >
            Remove
          </Button>
        </div>
      ) : previewUrl ? (
        <div className="flex flex-col items-start">
          <div className="mb-2 w-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-48 object-contain rounded-md"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemove}
            disabled={isUploading}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            className="cursor-pointer"
            onClick={triggerFileInput}
          >
            <div className="flex items-center px-4 py-2 border border-input rounded-md bg-background hover:bg-accent hover:text-accent-foreground">
              {isUploading ? (
                <Icons.spinner className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Icons.upload className="h-4 w-4 mr-2" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Accepted: {accept} | Max size: {maxSize}MB
      </p>
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-1">
          {currentUrl ? `URL: ${currentUrl}` : 'No file uploaded'}
        </div>
      )}
    </div>
  );
};

export default FileUpload;