import { supabase } from './client';

export interface UploadResult {
  url?: string;
  error?: string;
}

export const signupUpload = async (file: File, folder: 'photos' | 'dues'): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from('member-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('member-files')
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl };
  } catch (error) {
    console.error('Upload exception:', error);
    return { error: 'Upload failed' };
  }
};

export const uploadFile = async (file: File, bucket: string, folder: string): Promise<UploadResult> => {
  return signupUpload(file, folder as 'photos' | 'dues');
};