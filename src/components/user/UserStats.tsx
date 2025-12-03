import { Flex, Text, Box } from '@radix-ui/themes';

interface UserStatsProps {
  photosCount: number;
  collectionsCount: number;
  followersCount: number;
  followingCount: number;
}

export const UserStats = ({
  photosCount,
  collectionsCount,
  followersCount,
  followingCount,
}: UserStatsProps) => {
  return (
    <Flex gap="6" wrap="wrap">
      <Box>
        <Text size="4" weight="bold" style={{ display: 'block' }}>
          {photosCount.toLocaleString()}
        </Text>
        <Text size="2" color="gray">
          Photos
        </Text>
      </Box>
      <Box>
        <Text size="4" weight="bold" style={{ display: 'block' }}>
          {collectionsCount.toLocaleString()}
        </Text>
        <Text size="2" color="gray">
          Collections
        </Text>
      </Box>
      <Box>
        <Text size="4" weight="bold" style={{ display: 'block' }}>
          {followersCount.toLocaleString()}
        </Text>
        <Text size="2" color="gray">
          Followers
        </Text>
      </Box>
      <Box>
        <Text size="4" weight="bold" style={{ display: 'block' }}>
          {followingCount.toLocaleString()}
        </Text>
        <Text size="2" color="gray">
          Following
        </Text>
      </Box>
    </Flex>
  );
};
