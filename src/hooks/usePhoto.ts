import { useQuery } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';

export const usePhoto = (photoId: number) => {
  return useQuery({
    queryKey: ['photo', photoId],
    queryFn: () => photoService.getPhoto(photoId),
  });
};
