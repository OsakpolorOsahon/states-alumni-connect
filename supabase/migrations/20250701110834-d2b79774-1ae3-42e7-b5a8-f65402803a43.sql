
-- Create storage policies for the member-files bucket
-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'member-files' 
  AND auth.role() = 'authenticated'
);

-- Policy to allow users to view files (needed for profile photos, dues proofs, etc.)
CREATE POLICY "Users can view files" ON storage.objects 
FOR SELECT USING (
  bucket_id = 'member-files'
);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'member-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
) WITH CHECK (
  bucket_id = 'member-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'member-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow secretaries to manage all files (for administrative purposes)
CREATE POLICY "Secretaries can manage all files" ON storage.objects 
FOR ALL USING (
  bucket_id = 'member-files' 
  AND EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.uid() 
    AND role = 'secretary' 
    AND status = 'Active'
  )
) WITH CHECK (
  bucket_id = 'member-files' 
  AND EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.uid() 
    AND role = 'secretary' 
    AND status = 'Active'
  )
);
