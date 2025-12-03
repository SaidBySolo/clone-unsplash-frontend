import { Card, Box, Flex, Text, Avatar } from '@radix-ui/themes';
import { HeartIcon, DownloadIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import type { PhotoResponse } from '../../types';

interface PhotoCardProps {
  photo: PhotoResponse;
}

export const PhotoCard = ({ photo }: PhotoCardProps) => {
  return (
    <Link to={`/photos/${photo.id}`} style={{ textDecoration: 'none' }}>
      <Card style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
        <Box
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: `${(photo.height / photo.width) * 100}%`,
            backgroundColor: photo.color || '#f0f0f0',
          }}
        >
          <img
            src={photo.thumbnailUrl}
            alt={photo.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />

          <Box
            className="photo-card-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%)',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
          />

          {/* User info */}
          <Flex
            align="center"
            gap="2"
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
            className="photo-card-user"
          >
            <Avatar
              size="2"
              src={photo.user.profileImageUrl}
              fallback={photo.user.name[0]}
              radius="full"
            />
            <Text size="2" weight="medium" style={{ color: 'white' }}>
              {photo.user.name}
            </Text>
          </Flex>

          {/* Stats */}
          <Flex
            gap="3"
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
            className="photo-card-stats"
          >
            <Flex align="center" gap="1">
              <HeartIcon color="white" />
              <Text size="2" style={{ color: 'white' }}>
                {photo.likesCount}
              </Text>
            </Flex>
            <Flex align="center" gap="1">
              <DownloadIcon color="white" />
              <Text size="2" style={{ color: 'white' }}>
                {photo.downloadsCount}
              </Text>
            </Flex>
          </Flex>
        </Box>

        <style>{`
          .photo-card:hover .photo-card-overlay,
          .photo-card:hover .photo-card-user,
          .photo-card:hover .photo-card-stats {
            opacity: 1 !important;
          }
        `}</style>
      </Card>
    </Link>
  );
};
