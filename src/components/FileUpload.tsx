
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, X } from 'lucide-react';
import { uploadFile } from '@/integrations/supabase/fileUpload';

interface FileUploadProps {
  label: string;
  accept: string;
  folder: 'photos' | 'dues';
  onUpload: (url: string) => void;
  currentUrl?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  folder,
  onUpload,
  currentUrl,
  maxSize = 5
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await uploadFile(file, 'member-files', folder);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onUpload(result.url);
      }
    } catch (error) {
      clearInterval(progressInterval);
      setError('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const clearFile = () => {
    onUpload('');
    setError(null);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`file-${folder}`}>{label}</Label>
      
      {currentUrl ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground flex-1">File uploaded</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearFile}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              id={`file-${folder}`}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              disabled={uploading}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => document.getElementById(`file-${folder}`)?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
          
          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
