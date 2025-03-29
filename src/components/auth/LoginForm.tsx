
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: "Harap masukkan email yang valid"
  }),
  password: z.string().min(8, {
    message: "Password minimal 8 karakter"
  })
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSuccess?: (userData: any) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const handleRedirectToSignup = () => {
    // This will redirect to signup tab
    window.location.href = '/auth?tab=signup';
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // This is where you would make an API call to authenticate
      console.log('Login form submitted with:', data);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data that would come from API
      const userData = {
        id: 'user-123',
        name: 'User Demo',
        email: data.email,
        avatar: 'https://i.pravatar.cc/150?img=32'
      };

      // Success notification
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!"
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userData);
      } else {
        navigate('/');
      }
    } catch (error) {
      // Error notification
      toast({
        title: "Login gagal",
        description: "Email atau password salah",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="emailmu@contoh.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                </FormControl>
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-sm">
          <a href="#" className="text-primary hover:text-primary/90">
            Lupa password?
          </a>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : "Masuk"}
        </Button>
      </form>
    </Form>
  );
};
