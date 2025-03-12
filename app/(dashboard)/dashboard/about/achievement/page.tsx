'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Edit, Medal, Trash, Trophy, Upload, Users } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
  image: string;
}

export default function AchievementsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  const {
    data: achievements,
    isLoading,
    refetch,
  } = useGetList<Achievement>('/achievements', 'achievements');

  const { mutateAsync: createAchievement, isPending: isCreating } = useCreate(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: updateAchievement, isPending: isUpdating } = useUpdate<Achievement>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: deleteAchievement, isPending: isDeleting } = useDelete(
    '/achievements',
    'achievements',
  );

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : achievements?.filter((a) => a.category === selectedCategory);

  const handleCreateAchievement = async (formData: FormData) => {
    try {
      await createAchievement({
        body: formData,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'অর্জন সফলভাবে যোগ করা হয়েছে' });
            refetch();
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'অর্জন যোগ করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to create achievement:', error);
    }
  };

  const handleUpdateAchievement = async (id: string, formData: FormData) => {
    try {
      await updateAchievement({
        id,
        body: formData as unknown as Achievement,
        callbacks: {
          onSuccess: () => {
            toast({ title: 'সফল', description: 'অর্জন সফলভাবে আপডেট করা হয়েছে' });
            refetch();
            setEditingAchievement(null);
          },
          onError: (error) => {
            toast({
              title: 'ত্রুটি',
              description: error.message || 'অর্জন আপডেট করতে ব্যর্থ হয়েছে',
              variant: 'destructive',
            });
          },
        },
      });
    } catch (error) {
      console.error('Failed to update achievement:', error);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি এই অর্জন মুছে ফেলতে চান?')) {
      try {
        await deleteAchievement({
          id,
          callbacks: {
            onSuccess: () => {
              toast({ title: 'সফল', description: 'অর্জন সফলভাবে মুছে ফেলা হয়েছে' });
              refetch();
            },
            onError: (error) => {
              toast({
                title: 'ত্রুটি',
                description: error.message || 'অর্জন মুছে ফেলতে ব্যর্থ হয়েছে',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete achievement:', error);
      }
    }
  };

  if (isLoading) {
    return <div>লোড হচ্ছে...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">অর্জনসমূহ</h1>
        <AddAchievementModal onAddAchievement={handleCreateAchievement} isCreating={isCreating} />
      </div>

      <Tabs defaultValue="all" className="w-full mb-6" onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">সকল</TabsTrigger>
          <TabsTrigger value="academic">একাডেমিক</TabsTrigger>
          <TabsTrigger value="sports">ক্রীড়া</TabsTrigger>
          <TabsTrigger value="extracurricular">সহপাঠ্যক্রম</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements?.map((achievement) => (
          <Card key={achievement._id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-4">
                <AchievementIcon category={achievement.category} />
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingAchievement(achievement)}
                  disabled={isUpdating}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAchievement(achievement._id)}
                  disabled={isDeleting}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              {achievement.image && (
                <div className="mb-3">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${achievement.image}`}
                    alt={achievement.title}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg?height=200&width=300';
                    }}
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Badge variant="secondary">{achievement.year}</Badge>
                <Badge>{getCategoryName(achievement.category)}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingAchievement && (
        <EditAchievementModal
          achievement={editingAchievement}
          onUpdateAchievement={handleUpdateAchievement}
          onClose={() => setEditingAchievement(null)}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
}

interface AchievementFormData {
  title: string;
  description: string;
  year: string;
  category: 'academic' | 'sports' | 'extracurricular';
}

const AchievementForm = ({
  initialData,
  onSubmit,
  submitText,
  isSubmitting,
}: {
  initialData?: Achievement;
  onSubmit: (formData: FormData) => void;
  submitText: string;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    year: initialData?.year || new Date().getFullYear().toString(),
    category: initialData?.category || 'academic',
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Revoke previous object URL to avoid memory leaks
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast({
        title: 'ত্রুটি',
        description: 'শিরোনাম প্রয়োজন',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: 'ত্রুটি',
        description: 'বিবরণ প্রয়োজন',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.year.trim()) {
      toast({
        title: 'ত্রুটি',
        description: 'বছর প্রয়োজন',
        variant: 'destructive',
      });
      return;
    }

    if (!initialData && !file) {
      toast({
        title: 'ত্রুটি',
        description: 'ছবি প্রয়োজন',
        variant: 'destructive',
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('year', formData.year);
    submitFormData.append('category', formData.category);

    if (file) {
      submitFormData.append('image', file);
    }

    onSubmit(submitFormData);
  };

  // Clean up preview URL when component unmounts
  const cleanupPreview = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  // Clean up on unmount
  useState(() => {
    return () => {
      cleanupPreview();
    };
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">
          শিরোনাম <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">
          বিবরণ <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">
            বছর <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.year}
            onValueChange={(value) => setFormData({ ...formData, year: value })}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="বছর নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">
            ক্যাটাগরি <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value: 'academic' | 'sports' | 'extracurricular') =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">একাডেমিক</SelectItem>
              <SelectItem value="sports">ক্রীড়া</SelectItem>
              <SelectItem value="extracurricular">সহপাঠ্যক্রম</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image">ছবি {!initialData && <span className="text-red-500">*</span>}</Label>

        <div className="mt-2 grid gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                type="button"
              >
                <Upload className="h-4 w-4" />
                {file ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}
              </Button>
            </div>
            {file && (
              <div className="text-sm text-muted-foreground">
                {file.name} ({Math.round(file.size / 1024)} KB)
              </div>
            )}
          </div>

          <div className="mt-2">
            {(previewUrl || initialData?.image) && (
              <div className="relative border rounded-md p-2 mt-2">
                <p className="text-sm text-muted-foreground mb-2">ছবি প্রিভিউ:</p>
                <Image
                  src={
                    previewUrl ||
                    (initialData?.image
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${initialData.image}`
                      : '/placeholder.svg?height=200&width=300')
                  }
                  alt="Preview"
                  width={300}
                  height={200}
                  className="object-cover rounded-md h-[200px] w-full"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg?height=200&width=300';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'প্রক্রিয়াকরণ হচ্ছে...' : submitText}
        </Button>
      </div>
    </form>
  );
};

const AddAchievementModal = ({
  onAddAchievement,
  isCreating,
}: {
  onAddAchievement: (formData: FormData) => Promise<void>;
  isCreating: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>নতুন অর্জন যোগ করুন</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>নতুন অর্জন যোগ করুন</DialogTitle>
        </DialogHeader>
        <AchievementForm
          onSubmit={(formData) => {
            onAddAchievement(formData).then(() => {
              if (!isCreating) {
                setIsOpen(false);
              }
            });
          }}
          submitText="যোগ করুন"
          isSubmitting={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

const EditAchievementModal = ({
  achievement,
  onUpdateAchievement,
  onClose,
  isUpdating,
}: {
  achievement: Achievement;
  onUpdateAchievement: (id: string, formData: FormData) => Promise<void>;
  onClose: () => void;
  isUpdating: boolean;
}) => {
  const handleSubmit = (formData: FormData) => {
    onUpdateAchievement(achievement._id, formData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>অর্জন সম্পাদনা করুন</DialogTitle>
        </DialogHeader>
        <AchievementForm
          initialData={achievement}
          onSubmit={handleSubmit}
          submitText="আপডেট করুন"
          isSubmitting={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
};

function AchievementIcon({ category }: { category: Achievement['category'] }) {
  switch (category) {
    case 'academic':
      return <BookOpen className="h-6 w-6 text-blue-500" />;
    case 'sports':
      return <Medal className="h-6 w-6 text-green-500" />;
    case 'extracurricular':
      return <Users className="h-6 w-6 text-purple-500" />;
    default:
      return <Trophy className="h-6 w-6 text-yellow-500" />;
  }
}

function getCategoryName(category: Achievement['category']): string {
  switch (category) {
    case 'academic':
      return 'একাডেমিক';
    case 'sports':
      return 'ক্রীড়া';
    case 'extracurricular':
      return 'সহপাঠ্যক্রম';
    default:
      return 'অন্যান্য';
  }
}
