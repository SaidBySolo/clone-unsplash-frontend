import { useInfiniteQuery } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';
import type { PageResponse, PhotoResponse } from '../types';

export const useUserPhotos = (userId: number) => {
  return useInfiniteQuery<PageResponse<PhotoResponse>>({
    queryKey: ['photos', 'user', userId],
    queryFn: ({ pageParam = 0 }) => photoService.getUserPhotos(userId, pageParam as number, 20),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};
