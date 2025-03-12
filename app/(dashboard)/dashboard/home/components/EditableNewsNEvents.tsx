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
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface EventData {
  _id: string;
  id?: string;
  title: string;
  description: string;
  image: string;
  category?: string;
}

const EditableNewsNEvents = () => {
  const { data: eventsData, isLoading } = useGetList<EventData>('/news-events', 'news-events');
  const { mutateAsync: createEvent, isPending: isCreating } = useCreate(
    '/news-events',
    'news-events',
  );
  const { mutateAsync: updateEvent, isPending: isUpdating } = useUpdate<EventData>(
    '/news-events',
    'news-events',
  );
  const { mutateAsync: deleteEvent, isPending: isDeleting } = useDelete(
    '/news-events',
    'news-events',
  );

  const [currentEvent, setCurrentEvent] = useState<Partial<EventData> | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleEdit = (event: EventData) => {
    setCurrentEvent(event);
    setPreviewUrl(null);
    setFile(null);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setCurrentEvent({ title: '', description: '', category: 'event' });
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
    if (!currentEvent) return;

    // Validation
    if (!currentEvent.title?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentEvent.description?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Description is required',
        variant: 'destructive',
      });
      return;
    }

    if (!currentEvent._id && !file) {
      toast({
        title: 'Validation Error',
        description: 'Image is required for new events',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', currentEvent.title || '');
      formData.append('description', currentEvent.description || '');
      formData.append('category', currentEvent.category || 'event');

      if (file) {
        formData.append('image', file);
      }

      if (currentEvent._id) {
        await updateEvent({
          id: currentEvent._id,
          body: formData as unknown as EventData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event updated successfully',
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
                description: error?.message || 'Failed to update event',
                variant: 'destructive',
              });
            },
          },
        });
      } else {
        await createEvent({
          body: formData,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event created successfully',
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
                description: error?.message || 'Failed to create event',
                variant: 'destructive',
              });
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to save event:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  }, [currentEvent, file, previewUrl, updateEvent, createEvent]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('Are you sure you want to delete this event?')) {
        return;
      }

      try {
        await deleteEvent({
          id,
          callbacks: {
            onSuccess: () => {
              toast({
                title: 'Success',
                description: 'Event deleted successfully',
              });
            },
            onError: (error) => {
              toast({
                title: 'Error',
                description: error?.message || 'Failed to delete event',
                variant: 'destructive',
              });
            },
          },
        });
      } catch (error) {
        console.error('Failed to delete event:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive',
        });
      }
    },
    [deleteEvent],
  );

  const columns = [
    {
      title: 'Event Image',
      dataKey: 'image',
      row: (data: EventData) => (
        <div className="flex gap-5 items-center">
          <Image
            className="w-16 h-12 object-cover rounded-md"
            src={
              data.image
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data.image}`
                : '/placeholder.svg?height=50&width=50'
            }
            alt="Event image"
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
      title: 'Event Name',
      dataKey: 'title',
      row: (data: EventData) => <span>{data.title}</span>,
    },
    {
      title: 'Description',
      dataKey: 'description',
      row: (data: EventData) => (
        <span title={data.description}>
          {data.description.length > 50
            ? `${data.description.substring(0, 50)}...`
            : data.description}
        </span>
      ),
    },
    {
      title: 'Category',
      dataKey: 'category',
      row: (data: EventData) => <span className="capitalize">{data.category || 'N/A'}</span>,
    },
    {
      title: 'Actions',
      dataKey: 'actions',
      row: (data: EventData) => (
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

  return (
    <div className="editable border border-primary_school">
      <div className="flex heading items-center justify-between">
        <h2 className="grow">News & Events</h2>
        <Button className="rounded-none" onClick={handleAddNew}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add New Event
        </Button>
      </div>
      <SharedTable columns={columns} isLoading={isLoading} data={eventsData || []} />

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
            <DialogTitle>{currentEvent?._id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label htmlFor="title">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={currentEvent?.title || ''}
                onChange={(e) =>
                  setCurrentEvent((prev) => prev && { ...prev, title: e.target.value })
                }
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">
                Event Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="eventDescription"
                value={currentEvent?.description || ''}
                onChange={(e) =>
                  setCurrentEvent((prev) => prev && { ...prev, description: e.target.value })
                }
                className="mt-2"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={currentEvent?.category || 'event'}
                onValueChange={(value) =>
                  setCurrentEvent((prev) => prev && { ...prev, category: value })
                }
              >
                <SelectTrigger id="category" className="mt-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventImage">
                Event Image {!currentEvent?._id && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="eventImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2"
              />
              <div className="mt-2">
                {(previewUrl || currentEvent?.image) && (
                  <Image
                    src={
                      previewUrl ||
                      (currentEvent?.image
                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${currentEvent.image}`
                        : '/placeholder.svg?height=200&width=200')
                    }
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mt-2 object-cover rounded-md h-[200px] w-[200px]"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg?height=200&width=200';
                    }}
                  />
                )}
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

export default EditableNewsNEvents;
