import { useQuery } from '@tanstack/react-query';
import { collectionService } from '../services/collection.service';

export const useCollection = (collectionId: number) => {
  return useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => collectionService.getCollection(collectionId),
  });
};
