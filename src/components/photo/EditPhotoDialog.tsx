import * as Form from '@radix-ui/react-form';
import { Dialog, Button, TextField, TextArea, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../../services/photo.service';
import type { PhotoResponse, PhotoUpdateRequest } from '../../types';

interface EditPhotoDialogProps {
  photo: PhotoResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditPhotoDialog = ({ photo, open, onOpenChange }: EditPhotoDialogProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PhotoUpdateRequest>({
    title: photo.title,
    description: photo.description || '',
    tags: photo.tags || [],
  });
  const [tagsString, setTagsString] = useState(photo.tags?.join(', ') || '');

  const updateMutation = useMutation({
    mutationFn: () => {
      const tags = tagsString
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      return photoService.updatePhoto(photo.id, {
        ...formData,
        tags: tags.length > 0 ? tags : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo', photo.id] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Edit Photo</Dialog.Title>

        <Form.Root onSubmit={handleSubmit}>
          <Flex direction="column" gap="4" style={{ marginTop: '1rem' }}>
            <Form.Field name="title">
              <Flex direction="column" gap="1">
                <Form.Label>
                  <Text size="2" weight="medium">Title *</Text>
                </Form.Label>
                <Form.Message match="valueMissing">
                  <Text size="1" color="red">Title is required</Text>
                </Form.Message>
                <Form.Control asChild>
                  <TextField.Root
                    placeholder="Photo title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>

            <Form.Field name="description">
              <Flex direction="column" gap="1">
                <Form.Label>
                  <Text size="2" weight="medium">Description</Text>
                </Form.Label>
                <Form.Control asChild>
                  <TextArea
                    placeholder="Description"
                    rows={4}
                    maxLength={1000}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>

            <Form.Field name="tags">
              <Flex direction="column" gap="1">
                <Form.Label>
                  <Text size="2" weight="medium">Tags</Text>
                </Form.Label>
                <Form.Control asChild>
                  <TextField.Root
                    placeholder="nature, landscape, mountain"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>

            {updateMutation.isError && (
              <Text size="2" color="red">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : 'Failed to update photo'}
              </Text>
            )}

            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Form.Submit asChild>
                <Button disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save changes'}
                </Button>
              </Form.Submit>
            </Flex>
          </Flex>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
