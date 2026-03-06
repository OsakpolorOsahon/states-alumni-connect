import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, FileImage, FileText, Loader2 } from 'lucide-react';

interface SupabaseFileUploadProps {
  label: string;
  endpoint: 'memberPhotos' | 'duesProofs';
  onUpload: (url: string) => void;
  currentUrl?: string;
  maxSize?: string;
}

export default function SupabaseFileUpload({
  label,
  endpoint,
  onUpload,
  currentUrl,
  maxSize = '4MB'
}: SupabaseFileUploadProps) {
  const { toast } = useToast();
  const { user, supabaseClient } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = parseInt(maxSize) * 1024 * 1024;

  const getAcceptTypes = () => {
    if (endpoint === 'memberPhotos') {
      return 'image/jpeg,image/png,image/webp,image/gif';
    }
    return 'image/jpeg,image/png,image/webp,application/pdf';
  };

  const getIcon = () => {
    if (endpoint === 'memberPhotos') {
      return <FileImage className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const getDescription = () => {
    if (endpoint === 'memberPhotos') {
      return `Upload a clear photo of yourself (max ${maxSize})`;
    }
    return `Upload your dues payment proof (PDF or image, max ${maxSize})`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSize}`,
        variant: 'destructive',
      });
      return;
    }

    if (!supabaseClient || !user) {
      toast({
        title: 'Upload error',
        description: 'Not authenticated. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}/${endpoint}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabaseClient.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: urlData } = supabaseClient.storage
        .from('documents')
        .getPublicUrl(data.path);

      onUpload(urlData.publicUrl);
      toast({
        title: 'Upload successful',
        description: 'Your file has been uploaded successfully.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        {getIcon()}
        {label}
      </Label>
      
      {currentUrl ? (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">File uploaded successfully</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentUrl, '_blank')}
                data-testid={`button-view-${endpoint}`}
              >
                View File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                data-testid={`button-replace-${endpoint}`}
              >
                Replace
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm text-blue-600 font-medium">Uploading...</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-600 mb-3">{getDescription()}</p>
                    <Button
                      type="button"
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid={`button-upload-${endpoint}`}
                    >
                      Choose File
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
