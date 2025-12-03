import { Container, Box, Flex, Heading, Text, Avatar, Separator } from '@radix-ui/themes';
import { useParams, Link } from 'react-router-dom';
import { useCollection } from '../hooks/useCollection';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { format } from 'date-fns';

export const CollectionDetailPage = () => {
  const { collectionId } = useParams();
  const { data: collection, isLoading, isError, error } = useCollection(Number(collectionId));

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (isError || !collection) {
    return (
      <Container>
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Failed to load collection'}
        />
      </Container>
    );
  }

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Flex direction="column" gap="4">
        {/* Collection Header */}
        <Box>
          <Heading size="8" style={{ marginBottom: '0.5rem' }}>
            {collection.title}
          </Heading>
          {collection.description && (
            <Text size="3" color="gray" style={{ display: 'block', marginBottom: '1rem' }}>
              {collection.description}
            </Text>
          )}

          <Flex align="center" gap="3" style={{ marginBottom: '1rem' }}>
            <Link to={`/users/${collection.user.username}`} style={{ textDecoration: 'none' }}>
              <Flex align="center" gap="2">
                <Avatar
                  size="2"
                  src={collection.user.profileImageUrl}
                  fallback={collection.user.name[0]}
                  radius="full"
                />
                <Text size="2" weight="medium">
                  {collection.user.name}
                </Text>
              </Flex>
            </Link>
          </Flex>

          <Flex gap="4" wrap="wrap">
            <Text size="2" color="gray">
              {collection.photosCount} {collection.photosCount === 1 ? 'photo' : 'photos'}
            </Text>
            <Text size="2" color="gray">
              Created {format(new Date(collection.createdAt), 'MMM d, yyyy')}
            </Text>
            {collection.isPrivate && (
              <Text size="2" color="orange">
                🔒 Private
              </Text>
            )}
          </Flex>
        </Box>

        <Separator size="4" />

        {/* Photos - TODO: Implement collection photos grid */}
        {collection.photosCount === 0 ? (
          <EmptyState
            title="No photos in this collection"
            description="Add photos to this collection to get started"
          />
        ) : (
          <Box>
            <Text size="2" color="gray">
              Collection photos will be displayed here
            </Text>
          </Box>
        )}
      </Flex>
    </Container>
  );
};
