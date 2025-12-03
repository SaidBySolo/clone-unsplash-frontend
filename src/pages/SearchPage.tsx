import { Container, Flex, Button, Heading } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PhotoGrid } from '../components/photo/PhotoGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useSearchPhotos } from '../hooks/useSearchPhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useSearchPhotos(keyword);

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!keyword) {
    return (
      <Container>
        <EmptyState
          title="Enter a search query"
          description="Search for photos by keyword"
        />
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage
          message={error instanceof Error ? error.message : 'Search failed'}
        />
      </Container>
    );
  }

  const photos = data?.pages.flatMap((page) => page.content) || [];

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Heading size="6" style={{ marginBottom: '2rem' }}>
        Search results for "{keyword}"
      </Heading>

      {photos.length === 0 ? (
        <EmptyState
          title="No results found"
          description={`No photos found for "${keyword}". Try a different search term.`}
        />
      ) : (
        <>
          <PhotoGrid photos={photos} />

          <div ref={targetRef} style={{ height: '20px', margin: '2rem 0' }} />

          {isFetchingNextPage && <LoadingSpinner />}

          {!hasNextPage && photos.length > 0 && (
            <Flex justify="center" style={{ padding: '2rem' }}>
              <Button variant="ghost" disabled>
                No more results
              </Button>
            </Flex>
          )}
        </>
      )}
    </Container>
  );
};
