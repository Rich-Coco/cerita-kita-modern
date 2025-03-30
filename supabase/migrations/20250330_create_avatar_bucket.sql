
-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
    -- Check if bucket exists
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        -- Insert the bucket
        INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
        VALUES ('avatars', 'avatars', true, false, 5242880, '{image/*}');
        
        -- Set policies for the bucket
        -- Allow public read access
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Avatar Public Read Policy',
            'bucket_id = ''avatars''',
            'avatars'
        );
        
        -- Allow authenticated users to upload avatars
        INSERT INTO storage.policies (name, definition, bucket_id)
        VALUES (
            'Avatar Upload Policy',
            'bucket_id = ''avatars'' AND auth.role() = ''authenticated''',
            'avatars'
        );
    END IF;
END $$;
