import { useMutation, useQueryClient } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';

export const usePhotoLike = (photoId: number) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => photoService.likePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo', photoId] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => photoService.unlikePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo', photoId] });
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
};
