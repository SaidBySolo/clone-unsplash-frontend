import { Container, Flex, Button } from '@radix-ui/themes';
import { useEffect } from 'react';
import { PhotoGrid } from '../components/photo/PhotoGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useInfinitePhotos } from '../hooks/useInfinitePhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const HomePage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfinitePhotos();

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          message={error instanceof Error ? error.message : '사진을 불러오는데 실패했습니다'}
        />
      </Container>
    );
  }

  const photos = data?.pages.flatMap((page) => page.content) || [];

  if (photos.length === 0) {
    return (
      <Container>
        <EmptyState
          title="아직 사진이 없습니다"
          description="첫 번째 사진을 업로드하세요!"
        />
      </Container>
    );
  }

  return (
    <Container style={{ padding: '2rem 0' }}>
      <PhotoGrid photos={photos} />

      {/* Infinite scroll trigger */}
      <div ref={targetRef} style={{ height: '20px', margin: '2rem 0' }} />

      {isFetchingNextPage && <LoadingSpinner />}

      {!hasNextPage && photos.length > 0 && (
        <Flex justify="center" style={{ padding: '2rem' }}>
          <Button variant="ghost" disabled>
            더 이상 사진이 없습니다
          </Button>
        </Flex>
      )}
    </Container>
  );
};
