
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates the avatars bucket if it doesn't exist
 */
export const ensureAvatarsBucket = async () => {
  try {
    // First check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }

    const avatarBucketExists = buckets.some(bucket => bucket.name === 'avatars');
    
    if (!avatarBucketExists) {
      console.log('Avatars bucket does not exist, creating it...');
      const { error: createError } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      });
      
      if (createError) {
        console.error('Error creating avatars bucket:', createError);
        return false;
      }
      console.log('Avatars bucket created successfully');
    } else {
      console.log('Avatars bucket already exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring avatars bucket:', error);
    return false;
  }
};

/**
 * Uploads a file to the avatars bucket
 */
export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Ensure the avatars bucket exists
    await ensureAvatarsBucket();
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log('Uploading avatar:', filePath, 'Content-Type:', file.type);
    
    // Upload the file with correct content type
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw uploadError;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    console.log('Avatar uploaded successfully:', urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadAvatar:', error);
    return null;
  }
};
