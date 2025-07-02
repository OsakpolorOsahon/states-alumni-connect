import { supabase } from '@/integrations/supabase/client';

// Upload for authenticated users (existing functionality)
export const uploadFile = async (
  file: File,
  bucket: string = 'member-files',
  folder: 'photos' | 'dues'
): Promise<{ url?: string; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'User not authenticated' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { url: data.publicUrl };
  } catch (error) {
    return { error: 'Upload failed' };
  }
};

// NEW: Upload function for signup process (unauthenticated users)
export const signupUpload = async (
  file: File,
  folder: 'photos' | 'dues'
): Promise<{ url?: string; error?: string }> => {
  try {
    // Generate unique filename with timestamp and random string
    const fileExt = file.name.split('.').pop();
    const randomString = Math.random().toString(36).substring(2, 9);
    const fileName = `signups/${folder}/${Date.now()}-${randomString}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('member-files')
      .upload(fileName, file);

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('member-files')
      .getPublicUrl(fileName);

    return { url: data.publicUrl };
  } catch (error) {
    return { error: 'Signup upload failed' };
  }
};

// Delete function (unchanged)
export const deleteFile = async (
  url: string,
  bucket: string = 'member-files'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === bucket);
    if (bucketIndex === -1) return { success: false, error: 'Invalid file URL' };
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    if (!filePath) return { success: false, error: 'Invalid file path' };

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Delete failed' };
  }
};