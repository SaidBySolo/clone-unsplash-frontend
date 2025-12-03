import { useInfiniteQuery } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';
import type { PageResponse, PhotoResponse } from '../types';

export const useInfinitePhotos = () => {
  return useInfiniteQuery<PageResponse<PhotoResponse>>({
    queryKey: ['photos'],
    queryFn: ({ pageParam = 0 }) => photoService.getPhotos(pageParam as number, 20),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};
