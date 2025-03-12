'use client';

import type React from 'react';

import SharedTable from '@/components/table/SharedTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreate, useDelete, useGetList, useUpdate } from '@/hooks/APIHooks';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Upload } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface IAchievementData {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  year: string;
}

const AchievementsEditable = () => {
  const { data: achievements, isLoading } = useGetList<IAchievementData>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: updateAchievement, isPending: isUpdating } = useUpdate<IAchievementData>(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: createAchievement, isPending: isCreating } = useCreate(
    '/achievements',
    'achievements',
  );
  const { mutateAsync: deleteAchievement, isPending: isDeleting } = useDelete(
    '/achievements',
    'achievements',
  );

  const [currentAchievement, setCurrentAchievement] = useState<Partial<IAchievementData> | null>(
    null,
  );
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleEdit = (achievement: IAchievementData) => {
    setCurrentAchievement(achievement);
    setPreviewUrl(null);
    setFile(null);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentAchievement({
      title: '',
      description: '',
      image: '',
      category: 'academic',
      year: new Date().getFullYear().toString(),
    });
    setPreviewUrl(null);
    setFile(null);
    setDialogOpen(true);
  };

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

  const handleSave = useCallback(async () => {
    if (!currentAchievement) return;

    // Validation
    if (!currentAchievement.title?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentAchievement.description?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Description is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentAchievement.category) {
      toast({
        title: 'Validation Error',
        description: 'Category is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentAchievement.year) {
      toast({
        title: 'Validation Error',
        description: 'Year is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentAchievement._id && !file) {
      toast({
        title: 'Validation Error',
        description: 'Image is required for new achievements',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', currentAchievement.title || '');
      formData.append('description', currentAchievement.description || '');
      formData.append('category', currentAchievement.category || 'academic');
      formData.append('year', currentAchievement.year || new Date().getFullYear().toString());

      if (file) {
        formData.append('image', file);
      }

      if (currentAchievement._id) {
        await updateAchievement({
          id: currentAchievement._id,
          body: formData as unknown as IAchievementData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Achievement updated successfully',
              });
              setDialogOpen(false);
              // Clean up preview URL
              if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
              setFile(null);
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error?.message || 'Failed to update achievement',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createAchievement({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Achievement created successfully',
              });
              setDialogOpen(false);
              // Clean up preview URL
              if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
              setFile(null);
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error?.message || 'Failed to create achievement',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save achievement:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  }, [currentAchievement, file, previewUrl, updateAchievement, createAchievement]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Are you sure you want to delete this achievement?')) {
        return;
      }

      try {
        await deleteAchievement({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Achievement deleted successfully',
              });
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error?.message || 'Failed to delete achievement',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete achievement:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    },
    [deleteAchievement],
  );

  const columns = [
    {
      title: 'Achievement Image',
      dataKey: 'image',
      row: (data: IAchievementData) => (
        <div className="flex gap-5 items-center">
          <Image
            className="w-16 h-12 object-cover rounded-md"
            src={
              data.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`
                : '/placeholder.svg?height=50&width=50'
            }
            alt="Achievement image"
            width={50}
            height={50}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=50&width=50';
            }}
          />
        </div>
      ),
    },
    {
      title: 'Achievement Name',
      dataKey: 'title',
      row: (data: IAchievementData) => <span>{data.title}</span>,
    },
    {
      title: 'Category',
      dataKey: 'category',
      row: (data: IAchievementData) => <span className="capitalize">{data.category || 'N/A'}</span>,
    },
    {
      title: 'Year',
      dataKey: 'year',
      row: (data: IAchievementData) => <span>{data.year || 'N/A'}</span>,
    },
    {
      title: 'Description',
      dataKey: 'description',
      row: (data: IAchievementData) => (
        <span title={data.description}>
          {data.description.length > 50
            ? `${data.description.substring(0, 50)}...`
            : data.description}
        </span>
      ),
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: IAchievementData) => (
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(data)}
            disabled={isUpdating}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(data._id)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="editable border border-primary_school">
      <div className="flex heading items-center justify-between">
        <h2 className="grow">Achievements</h2>
        <Button className="rounded-none" onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Achievement
        </Button>
      </div>
      <SharedTable columns={columns} isLoading={isLoading} data={achievements || []} />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open && previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }
          setDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {currentAchievement?._id ? 'Edit Achievement' : 'Add Achievement'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">
                Achievement Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={currentAchievement?.title || ''}
                onChange={(e) =>
                  setCurrentAchievement((prev) => prev && { ...prev, title: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentAchievement?.category || ''}
                  onValueChange={(value) =>
                    setCurrentAchievement((prev) => prev && { ...prev, category: value })
                  }
                >
                  <SelectTrigger id="category" className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="extracurricular">Extracurricular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={currentAchievement?.year || ''}
                  onValueChange={(value) =>
                    setCurrentAchievement((prev) => prev && { ...prev, year: value })
                  }
                >
                  <SelectTrigger id="year" className="mt-2">
                    <SelectValue placeholder="Select year" />
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
            </div>
            <div>
              <Label htmlFor="eventDescription">
                Achievement Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="eventDescription"
                value={currentAchievement?.description || ''}
                onChange={(e) =>
                  setCurrentAchievement((prev) => prev && { ...prev, description: e.target.value })
                }
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="eventImage">
                Achievement Image{' '}
                {!currentAchievement?._id && <span className="text-red-500">*</span>}
              </Label>

              <div className="mt-2 grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="eventImage"
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
                      {file ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </div>
                  {file && (
                    <div className="text-sm text-muted-foreground">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  {(previewUrl || currentAchievement?.image) && (
                    <div className="relative border rounded-md p-2 mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                      <Image
                        src={
                          previewUrl ||
                          (currentAchievement?.image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentAchievement.image}`
                            : '/placeholder.svg?height=200&width=200')
                        }
                        alt="Preview"
                        width={200}
                        height={200}
                        className="object-cover rounded-md h-[200px] w-full"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg?height=200&width=200';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchievementsEditable;
