import { Flex, Heading, Text } from '@radix-ui/themes';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ padding: '4rem 2rem', textAlign: 'center' }}
    >
      <Heading size="6" style={{ marginBottom: '0.5rem' }}>
        {title}
      </Heading>
      {description && (
        <Text size="3" color="gray">
          {description}
        </Text>
      )}
    </Flex>
  );
};
