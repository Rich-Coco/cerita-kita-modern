import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { toast } from '@/hooks/use-toast';

const Auth = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="text-2xl text-center text-muted-foreground">
      Login/auth tidak tersedia dalam build ini.
    </div>
  </div>
);

export default Auth;
