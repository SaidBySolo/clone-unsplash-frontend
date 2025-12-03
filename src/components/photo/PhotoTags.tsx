import { Badge, Flex } from '@radix-ui/themes';
import { Link } from 'react-router-dom';

interface PhotoTagsProps {
  tags: string[];
}

export const PhotoTags = ({ tags }: PhotoTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <Flex gap="2" wrap="wrap">
      {tags.map((tag) => (
        <Link
          key={tag}
          to={`/search?q=${encodeURIComponent(tag)}`}
          style={{ textDecoration: 'none' }}
        >
          <Badge variant="soft" style={{ cursor: 'pointer' }}>
            {tag}
          </Badge>
        </Link>
      ))}
    </Flex>
  );
};
