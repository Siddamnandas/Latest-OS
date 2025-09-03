'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Form validation schema matching the API
const profileSchema = z.object({
  partner_a_name: z.string().min(1, 'Partner A name is required'),
  partner_b_name: z.string().min(1, 'Partner B name is required'),
  anniversary_date: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.enum(['north-india', 'south-india', 'east-india', 'west-india', 'central-india']),
  language: z.string().min(1, 'Language is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditModal({ open, onOpenChange }: ProfileEditModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      partner_a_name: '',
      partner_b_name: '',
      anniversary_date: '',
      city: '',
      region: 'north-india',
      language: '',
    },
  });

  // Fetch current profile data
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await axios.get('/api/profile');
      return response.data;
    },
    enabled: open,
    onSuccess: (data) => {
      // Reset form with current data
      form.reset({
        partner_a_name: data.partner_a_name || '',
        partner_b_name: data.partner_b_name || '',
        anniversary_date: data.anniversary_date || '',
        city: data.city || '',
        region: data.region || 'north-india',
        language: data.language || '',
      });
      setProfileImage(data.profile_image);
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const response = await axios.put('/api/profile', formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: 'Profile Updated!',
        description: 'Your profile has been successfully updated.',
      });

      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);

      const errorMessage = error?.response?.data?.error || 'Failed to update profile';
      const validationErrors = error?.response?.data?.details;

      if (validationErrors) {
        // Handle validation errors
        Object.entries(validationErrors).forEach(([field, messages]) => {
          form.setError(field as keyof ProfileFormData, {
            message: Array.isArray(messages) ? messages[0].message : messages,
          });
        });
      } else {
        toast({
          title: 'Update Failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Handle basic image upload (in a real app, you'd upload to cloud storage)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setProfileImage(result);
      setImageFile(file);
    };
    reader.readAsDataURL(file);

    toast({
      title: 'Image Uploaded',
      description: 'Profile image has been updated.',
    });
  };

  const removeImage = () => {
    setProfileImage(null);
    setImageFile(null);
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const regionalFestivals = {
    'north-india': 'Holi, Diwali, Karva Chauth',
    'south-india': 'Onam, Pongal, Ugadi',
    'east-india': 'Durga Puja, Rath Yatra, Baisakhi',
    'west-india': 'Raksha Bandhan, Ganesh Chaturthi, Navratri',
    'central-india': 'Diwali, Holi, Dussehra',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Edit Profile
          </DialogTitle>
          <p className="text-gray-600">Update your couple profile and cultural preferences</p>
        </DialogHeader>

        {isLoadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    📱 Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          `${form.watch('partner_a_name')?.charAt(0) || '?'}${form.watch('partner_b_name')?.charAt(0) || '?'}`
                        )}
                      </div>
                      {profileImage && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1">
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
                          <Upload className="w-4 h-4" />
                          {profileImage ? 'Change Picture' : 'Upload Picture'}
                        </div>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG or GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Couple Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    💑 Couple Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="partner_a_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner A Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Partner A's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partner_b_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner B Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Partner B's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="anniversary_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Anniversary Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Cultural Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    🌍 Cultural Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indian Region</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="north-india">North India</SelectItem>
                            <SelectItem value="south-india">South India</SelectItem>
                            <SelectItem value="east-india">East India</SelectItem>
                            <SelectItem value="west-india">West India</SelectItem>
                            <SelectItem value="central-india">Central India</SelectItem>
                          </SelectContent>
                        </Select>

                        <p className="text-sm text-gray-600 mt-1">
                          {form.watch('region') && (
                            <>Popular festivals: {regionalFestivals[form.watch('region') as keyof typeof regionalFestivals]}</>
                          )}
                        </p>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Language</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hindi">Hindi</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="bengali">Bengali</SelectItem>
                            <SelectItem value="tamil">Tamil</SelectItem>
                            <SelectItem value="telugu">Telugu</SelectItem>
                            <SelectItem value="marathi">Marathi</SelectItem>
                            <SelectItem value="gujarati">Gujarati</SelectItem>
                            <SelectItem value="punjabi">Punjabi</SelectItem>
                            <SelectItem value="malayalam">Malayalam</SelectItem>
                            <SelectItem value="kannada">Kannada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
