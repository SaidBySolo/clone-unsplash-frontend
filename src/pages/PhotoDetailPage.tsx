import { Container, Box, Flex, Heading, Text, Avatar, Separator, Button, DropdownMenu } from '@radix-ui/themes';
import { useParams, Link } from 'react-router-dom';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { usePhoto } from '../hooks/usePhoto';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { PhotoActions } from '../components/photo/PhotoActions';
import { PhotoTags } from '../components/photo/PhotoTags';
import { EditPhotoDialog } from '../components/photo/EditPhotoDialog';
import { DeletePhotoDialog } from '../components/photo/DeletePhotoDialog';
import { format } from 'date-fns';

export const PhotoDetailPage = () => {
  const { photoId } = useParams();
  const { data: photo, isLoading, isError, error } = usePhoto(Number(photoId));
  const { isAuthenticated } = useAuthStore();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const currentUserId = authService.getUserId();
  const isOwner = isAuthenticated && photo && currentUserId === photo.user.id;

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (isError || !photo) {
    return (
      <Container>
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load photo'}
        />
      </Container>
    );
  }

  return (
    <Container size="3" style={{ padding: '2rem 0' }}>
      <Flex direction="column" gap="4">
        {/* Photo */}
        <Box
          style={{
            width: '100%',
            borderRadius: 'var(--radius-3)',
            overflow: 'hidden',
            backgroundColor: photo.color || '#f0f0f0',
          }}
        >
          <img
            src={photo.imageUrl}
            alt={photo.title}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </Box>

        {/* Actions */}
        <Flex justify="between" align="center">
          <Link to={`/users/${photo.user.username}`} style={{ textDecoration: 'none' }}>
            <Flex align="center" gap="3">
              <Avatar
                size="3"
                src={photo.user.profileImageUrl}
                fallback={photo.user.name[0]}
                radius="full"
              />
              <Box>
                <Text size="3" weight="bold" style={{ display: 'block' }}>
                  {photo.user.name}
                </Text>
                <Text size="2" color="gray">
                  @{photo.user.username}
                </Text>
              </Box>
            </Flex>
          </Link>

          <Flex gap="2" align="center">
            <PhotoActions
              photoId={photo.id}
              isLiked={photo.likedByCurrentUser}
              likesCount={photo.likesCount}
              imageUrl={photo.imageUrl}
              title={photo.title}
            />

            {isOwner && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="soft" color="gray">
                    <DotsVerticalIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item onClick={() => setEditDialogOpen(true)}>
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator />
                  <DropdownMenu.Item color="red" onClick={() => setDeleteDialogOpen(true)}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </Flex>
        </Flex>

        <Separator size="4" />

        {/* Info */}
        <Box>
          <Heading size="6" style={{ marginBottom: '0.5rem' }}>
            {photo.title}
          </Heading>
          {photo.description && (
            <Text size="3" color="gray" style={{ display: 'block', marginBottom: '1rem' }}>
              {photo.description}
            </Text>
          )}
        </Box>

        {/* Tags */}
        {photo.tags && photo.tags.length > 0 && (
          <PhotoTags tags={photo.tags} />
        )}

        <Separator size="4" />

        {/* Stats */}
        <Flex gap="6" wrap="wrap">
          <Box>
            <Text size="2" color="gray" style={{ display: 'block' }}>
              Views
            </Text>
            <Text size="4" weight="bold">
              {photo.viewsCount.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text size="2" color="gray" style={{ display: 'block' }}>
              Downloads
            </Text>
            <Text size="4" weight="bold">
              {photo.downloadsCount.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text size="2" color="gray" style={{ display: 'block' }}>
              Likes
            </Text>
            <Text size="4" weight="bold">
              {photo.likesCount.toLocaleString()}
            </Text>
          </Box>
          <Box>
            <Text size="2" color="gray" style={{ display: 'block' }}>
              Published
            </Text>
            <Text size="4" weight="bold">
              {format(new Date(photo.createdAt), 'MMM d, yyyy')}
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Dialogs */}
      {isOwner && (
        <>
          <EditPhotoDialog
            photo={photo}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
          />
          <DeletePhotoDialog
            photoId={photo.id}
            photoTitle={photo.title}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      )}
    </Container>
  );
};
