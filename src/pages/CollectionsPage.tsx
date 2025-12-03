import { Container, Flex, Button, Heading } from '@radix-ui/themes';
import { useEffect } from 'react';
import { CollectionGrid } from '../components/collection/CollectionGrid';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { useInfiniteCollections } from '../hooks/useInfiniteCollections';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const CollectionsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteCollections();

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
          message={error instanceof Error ? error.message : '컬렉션을 불러오는데 실패했습니다'}
        />
      </Container>
    );
  }

  const collections = data?.pages.flatMap((page) => page.content) || [];

  if (collections.length === 0) {
    return (
      <Container>
        <EmptyState
          title="아직 컬렉션이 없습니다"
          description="첫 번째 컬렉션을 만들어보세요!"
        />
      </Container>
    );
  }

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Heading size="8" style={{ marginBottom: '2rem' }}>
        컬렉션
      </Heading>

      <CollectionGrid collections={collections} />

      <div ref={targetRef} style={{ height: '20px', margin: '2rem 0' }} />

      {isFetchingNextPage && <LoadingSpinner />}

      {!hasNextPage && collections.length > 0 && (
        <Flex justify="center" style={{ padding: '2rem' }}>
          <Button variant="ghost" disabled>
            더 이상 컬렉션이 없습니다
          </Button>
        </Flex>
      )}
    </Container>
  );
};
