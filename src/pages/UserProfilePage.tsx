import { Container, Flex, Heading, Text, Avatar, Box, Button, Separator } from '@radix-ui/themes';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useUserPhotos } from '../hooks/useUserPhotos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { PhotoGrid } from '../components/photo/PhotoGrid';
import { UserStats } from '../components/user/UserStats';
import { FollowButton } from '../components/user/FollowButton';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

export const UserProfilePage = () => {
  const { username } = useParams();
  const { isAuthenticated } = useAuthStore();

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useUser(username!);

  const {
    data: photosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPhotosLoading,
  } = useUserPhotos(user?.id || 0);

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isUserLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  if (isUserError || !user) {
    return (
      <Container>
        <ErrorMessage
          message={userError instanceof Error ? userError.message : 'Failed to load user'}
        />
      </Container>
    );
  }

  const currentUserId = authService.getUserId();
  const isOwnProfile = isAuthenticated && currentUserId === user.id;
  const photos = photosData?.pages.flatMap((page) => page.content) || [];

  return (
    <Container style={{ padding: '2rem 0' }}>
      <Flex direction="column" gap="4">
        {/* Profile Header */}
        <Flex direction="column" align="center" gap="4" style={{ textAlign: 'center', padding: '2rem 0' }}>
          <Avatar
            size="9"
            src={user.profileImageUrl || undefined}
            fallback={user.name[0]}
            radius="full"
          />

          <Box>
            <Heading size="8" style={{ marginBottom: '0.5rem' }}>
              {user.name}
            </Heading>
            <Text size="3" color="gray" style={{ display: 'block', marginBottom: '1rem' }}>
              @{user.username}
            </Text>

            {user.bio && (
              <Text size="3" style={{ display: 'block', marginBottom: '1rem', maxWidth: '600px' }}>
                {user.bio}
              </Text>
            )}

            {(user.location || user.portfolioUrl) && (
              <Flex justify="center" gap="3" style={{ marginBottom: '1rem' }}>
                {user.location && (
                  <Text size="2" color="gray">
                    📍 {user.location}
                  </Text>
                )}
                {user.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-9)' }}>
                    <Text size="2">🔗 {user.portfolioUrl}</Text>
                  </a>
                )}
              </Flex>
            )}
          </Box>

          {!isOwnProfile && <FollowButton userId={user.id} />}
          {isOwnProfile && (
            <Button variant="outline">
              Edit Profile
            </Button>
          )}

          <UserStats
            photosCount={user.photosCount}
            collectionsCount={user.collectionsCount}
            followersCount={user.followersCount}
            followingCount={user.followingCount}
          />
        </Flex>

        <Separator size="4" />

        {/* Photos */}
        <Box>
          <Heading size="6" style={{ marginBottom: '2rem' }}>
            Photos
          </Heading>

          {isPhotosLoading ? (
            <LoadingSpinner />
          ) : photos.length === 0 ? (
            <EmptyState
              title="No photos yet"
              description={isOwnProfile ? "Upload your first photo!" : `${user.name} hasn't uploaded any photos yet.`}
            />
          ) : (
            <>
              <PhotoGrid photos={photos} />
              <div ref={targetRef} style={{ height: '20px', margin: '2rem 0' }} />
              {isFetchingNextPage && <LoadingSpinner />}
              {!hasNextPage && photos.length > 0 && (
                <Flex justify="center" style={{ padding: '2rem' }}>
                  <Button variant="ghost" disabled>
                    No more photos
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Box>
      </Flex>
    </Container>
  );
};
