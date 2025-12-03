import * as Form from '@radix-ui/react-form';
import { Dialog, Button, TextField, TextArea, Flex, Text, Switch } from '@radix-ui/themes';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection.service';
import type { CollectionRequest, CollectionResponse } from '../../types';

interface CollectionDialogProps {
  collection?: CollectionResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CollectionDialog = ({ collection, open, onOpenChange }: CollectionDialogProps) => {
  const queryClient = useQueryClient();
  const isEdit = !!collection;

  const [formData, setFormData] = useState<CollectionRequest>({
    title: collection?.title || '',
    description: collection?.description || '',
    isPrivate: collection?.isPrivate || false,
  });

  const mutation = useMutation({
    mutationFn: () => {
      if (isEdit) {
        return collectionService.updateCollection(collection.id, formData);
      }
      return collectionService.createCollection(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      if (isEdit) {
        queryClient.invalidateQueries({ queryKey: ['collection', collection.id] });
      }
      onOpenChange(false);
      // Reset form
      setFormData({ title: '', description: '', isPrivate: false });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>
          {isEdit ? 'Edit Collection' : 'Create Collection'}
        </Dialog.Title>

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
                    placeholder="Collection title"
                    required
                    maxLength={100}
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
                    placeholder="Collection description (optional)"
                    rows={4}
                    maxLength={1000}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Control>
              </Flex>
            </Form.Field>

            <Flex align="center" gap="2">
              <Switch
                checked={formData.isPrivate}
                onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
              />
              <Text size="2">Make this collection private</Text>
            </Flex>

            {mutation.isError && (
              <Text size="2" color="red">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : 'Operation failed'}
              </Text>
            )}

            <Flex gap="3" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Form.Submit asChild>
                <Button disabled={mutation.isPending}>
                  {mutation.isPending ? 'Saving...' : isEdit ? 'Save changes' : 'Create'}
                </Button>
              </Form.Submit>
            </Flex>
          </Flex>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
