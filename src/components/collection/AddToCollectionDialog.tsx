import { Dialog, Button, Flex, Text, Box, ScrollArea } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService } from '../../services/collection.service';
import { authService } from '../../services/auth.service';
import { CollectionDialog } from './CollectionDialog';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface AddToCollectionDialogProps {
  photoId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddToCollectionDialog = ({ photoId, open, onOpenChange }: AddToCollectionDialogProps) => {
  const queryClient = useQueryClient();
  const userId = authService.getUserId();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections', 'user', userId],
    queryFn: () => collectionService.getUserCollections(userId!, 0, 100),
    enabled: !!userId && open,
  });

  const addMutation = useMutation({
    mutationFn: (collectionId: number) =>
      collectionService.addPhotoToCollection(collectionId, { photoId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      onOpenChange(false);
    },
  });

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title>Add to Collection</Dialog.Title>

          <Flex direction="column" gap="3" style={{ marginTop: '1rem' }}>
            <Button
              variant="soft"
              onClick={() => setCreateDialogOpen(true)}
              style={{ width: '100%' }}
            >
              <PlusIcon /> Create New Collection
            </Button>

            {isLoading ? (
              <LoadingSpinner />
            ) : collections && collections.content.length > 0 ? (
              <ScrollArea style={{ maxHeight: '300px' }}>
                <Flex direction="column" gap="2">
                  {collections.content.map((collection) => (
                    <Button
                      key={collection.id}
                      variant="outline"
                      onClick={() => addMutation.mutate(collection.id)}
                      disabled={addMutation.isPending}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Flex direction="column" align="start" gap="1">
                        <Text weight="medium">{collection.title}</Text>
                        <Text size="1" color="gray">
                          {collection.photosCount} photos
                        </Text>
                      </Flex>
                    </Button>
                  ))}
                </Flex>
              </ScrollArea>
            ) : (
              <Box style={{ padding: '2rem', textAlign: 'center' }}>
                <Text color="gray">
                  You don't have any collections yet. Create one to get started!
                </Text>
              </Box>
            )}

            {addMutation.isError && (
              <Text size="2" color="red">
                {addMutation.error instanceof Error
                  ? addMutation.error.message
                  : 'Failed to add photo'}
              </Text>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <CollectionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  );
};
