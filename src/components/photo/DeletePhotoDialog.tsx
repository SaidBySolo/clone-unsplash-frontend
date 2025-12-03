import { Dialog, Button, Flex, Text } from '@radix-ui/themes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { photoService } from '../../services/photo.service';

interface DeletePhotoDialogProps {
  photoId: number;
  photoTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeletePhotoDialog = ({
  photoId,
  photoTitle,
  open,
  onOpenChange,
}: DeletePhotoDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => photoService.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      onOpenChange(false);
      navigate('/');
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Delete Photo</Dialog.Title>
        <Dialog.Description size="2" style={{ marginBottom: '1rem' }}>
          <Text>
            Are you sure you want to delete "{photoTitle}"? This action cannot be undone.
          </Text>
        </Dialog.Description>

        {deleteMutation.isError && (
          <Text size="2" color="red" style={{ marginBottom: '1rem', display: 'block' }}>
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : 'Failed to delete photo'}
          </Text>
        )}

        <Flex gap="3" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            color="red"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
