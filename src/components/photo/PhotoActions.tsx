import { IconButton, Flex } from '@radix-ui/themes';
import { HeartIcon, HeartFilledIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { usePhotoLike } from '../../hooks/usePhotoLike';
import { useAuthStore } from '../../store/authStore';
import { photoService } from '../../services/photo.service';
import { AddToCollectionDialog } from '../collection/AddToCollectionDialog';

interface PhotoActionsProps {
  photoId: number;
  isLiked: boolean;
  likesCount: number;
  imageUrl: string;
  title: string;
}

export const PhotoActions = ({ photoId, isLiked, likesCount, imageUrl, title }: PhotoActionsProps) => {
  const { isAuthenticated } = useAuthStore();
  const { like, unlike, isLiking, isUnliking } = usePhotoLike(photoId);
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [localCount, setLocalCount] = useState(likesCount);
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);

  const handleLikeToggle = () => {
    if (!isAuthenticated) {
      // TODO: Show login dialog
      return;
    }

    // Optimistic update
    setLocalLiked(!localLiked);
    setLocalCount(localLiked ? localCount - 1 : localCount + 1);

    if (localLiked) {
      unlike();
    } else {
      like();
    }
  };

  const handleDownload = async () => {
    try {
      await photoService.downloadPhoto(photoId);

      // Download the image
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `${title}.jpg`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleAddToCollection = () => {
    if (!isAuthenticated) {
      // TODO: Show login dialog
      return;
    }
    setAddToCollectionOpen(true);
  };

  return (
    <>
      <Flex gap="2">
        <IconButton
          variant="soft"
          color={localLiked ? 'red' : 'gray'}
          onClick={handleLikeToggle}
          disabled={isLiking || isUnliking}
        >
          {localLiked ? <HeartFilledIcon /> : <HeartIcon />}
        </IconButton>

        <IconButton variant="soft" onClick={handleAddToCollection}>
          <PlusIcon />
        </IconButton>

        <IconButton variant="soft" onClick={handleDownload}>
          <DownloadIcon />
        </IconButton>
      </Flex>

      <AddToCollectionDialog
        photoId={photoId}
        open={addToCollectionOpen}
        onOpenChange={setAddToCollectionOpen}
      />
    </>
  );
};