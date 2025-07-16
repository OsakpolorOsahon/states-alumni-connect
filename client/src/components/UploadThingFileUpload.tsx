import React, { useState } from 'react';
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, Upload, FileImage, FileText } from 'lucide-react';

interface UploadThingFileUploadProps {
  label: string;
  endpoint: 'memberPhotos' | 'duesProofs';
  onUpload: (url: string) => void;
  currentUrl?: string;
  accept?: string;
  maxSize?: string;
}

export default function UploadThingFileUpload({
  label,
  endpoint,
  onUpload,
  currentUrl,
  accept,
  maxSize = '4MB'
}: UploadThingFileUploadProps) {
  // Removed broken hooks
  const [isUploading, setIsUploading] = useState(false);

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

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        {getIcon()}
        {label}
      </Label>
      
      {currentUrl ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">File uploaded successfully</span>
            </div>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(currentUrl, '_blank')}
              >
                View File
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm text-gray-600 mb-2">{getDescription()}</p>
                <UploadButton
                  endpoint={endpoint}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.url) {
                      onUpload(res[0].url);
                      toast({
                        title: 'Upload successful',
                        description: 'Your file has been uploaded successfully.',
                      });
                    }
                    setIsUploading(false);
                  }}
                  onUploadError={(error) => {
                    console.error('Upload error:', error);
                    toast({
                      title: 'Upload failed',
                      description: error.message || 'Failed to upload file. Please try again.',
                      variant: 'destructive',
                    });
                    setIsUploading(false);
                  }}
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                  appearance={{
                    button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    allowedContent: "text-xs text-gray-500 mt-1"
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isUploading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
}