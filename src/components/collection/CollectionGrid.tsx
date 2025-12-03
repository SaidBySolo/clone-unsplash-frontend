import { Grid } from '@radix-ui/themes';
import { CollectionCard } from './CollectionCard';
import type { CollectionResponse } from '../../types';

interface CollectionGridProps {
  collections: CollectionResponse[];
}

export const CollectionGrid = ({ collections }: CollectionGridProps) => {
  return (
    <Grid columns={{ initial: '1', sm: '2', md: '3' }} gap="4">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </Grid>
  );
};
