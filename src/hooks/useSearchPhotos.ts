import { useInfiniteQuery } from '@tanstack/react-query';
import { photoService } from '../services/photo.service';
import type { PageResponse, PhotoResponse } from '../types';

export const useSearchPhotos = (keyword: string) => {
  return useInfiniteQuery<PageResponse<PhotoResponse>>({
    queryKey: ['photos', 'search', keyword],
    queryFn: ({ pageParam = 0 }) =>
      photoService.searchPhotos(keyword, pageParam as number, 20),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
    enabled: keyword.trim().length > 0,
  });
};
