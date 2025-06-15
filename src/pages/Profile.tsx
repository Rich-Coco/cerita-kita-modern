import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { User, Bookmark, BookOpen, Settings, Pencil, Save, Coins, Upload, Loader2, Wallet } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { uploadAvatar } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-2xl text-center text-muted-foreground">
        Profil dan fitur user dinonaktifkan untuk demo statis ini.
      </div>
    </div>
  );
};

export default Profile;
