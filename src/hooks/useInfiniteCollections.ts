import { useInfiniteQuery } from '@tanstack/react-query';
import { collectionService } from '../services/collection.service';
import type { PageResponse, CollectionResponse } from '../types';

export const useInfiniteCollections = () => {
  return useInfiniteQuery<PageResponse<CollectionResponse>>({
    queryKey: ['collections'],
    queryFn: ({ pageParam = 0 }) => collectionService.getPublicCollections(pageParam as number, 20),
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 0,
  });
};
