import { Box, Container, Flex, Text } from '@radix-ui/themes';

export const Footer = () => {
  return (
    <Box style={{ borderTop: '1px solid var(--gray-a5)', padding: '2rem 0', marginTop: '4rem' }}>
      <Container>
        <Flex justify="between" align="center">
          <Text size="2" color="gray">
            © 2025 Unsplash Clone
          </Text>
          <Flex gap="4">
            <Text size="2" color="gray">About</Text>
            <Text size="2" color="gray">API</Text>
            <Text size="2" color="gray">Privacy</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};
