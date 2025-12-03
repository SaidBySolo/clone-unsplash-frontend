import { Card, Box, Flex, Text, Avatar } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import type { CollectionResponse } from '../../types';

interface CollectionCardProps {
  collection: CollectionResponse;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  const coverPhotos = collection.coverPhotos.slice(0, 3);

  return (
    <Link to={`/collections/${collection.id}`} style={{ textDecoration: 'none' }}>
      <Card style={{ overflow: 'hidden', cursor: 'pointer' }}>
        {/* Cover Photos Grid */}
        <Box style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
          {coverPhotos.length === 0 ? (
            <Box
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--gray-a3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text color="gray">No photos</Text>
            </Box>
          ) : coverPhotos.length === 1 ? (
            <img
              src={coverPhotos[0]}
              alt={collection.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Flex gap="1" style={{ height: '100%' }}>
              <Box style={{ flex: 2 }}>
                <img
                  src={coverPhotos[0]}
                  alt={collection.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <Flex direction="column" gap="1" style={{ flex: 1 }}>
                {coverPhotos.slice(1).map((photo, index) => (
                  <Box key={index} style={{ flex: 1 }}>
                    <img
                      src={photo}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Flex>
            </Flex>
          )}
        </Box>

        {/* Info */}
        <Box style={{ padding: '1rem' }}>
          <Flex direction="column" gap="2">
            <Box>
              <Text size="4" weight="bold" style={{ display: 'block' }}>
                {collection.title}
              </Text>
              <Text size="2" color="gray">
                {collection.photosCount} {collection.photosCount === 1 ? 'photo' : 'photos'}
              </Text>
            </Box>

            {collection.description && (
              <Text size="2" color="gray" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {collection.description}
              </Text>
            )}

            <Flex align="center" gap="2">
              <Avatar
                size="1"
                src={collection.user.profileImageUrl}
                fallback={collection.user.name[0]}
                radius="full"
              />
              <Text size="2" color="gray">
                {collection.user.name}
              </Text>
            </Flex>
          </Flex>
        </Box>
      </Card>
    </Link>
  );
};
