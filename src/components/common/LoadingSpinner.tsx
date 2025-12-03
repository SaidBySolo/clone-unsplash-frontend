import { Flex, Spinner } from '@radix-ui/themes';

export const LoadingSpinner = () => {
  return (
    <Flex justify="center" align="center" style={{ padding: '3rem' }}>
      <Spinner size="3" />
    </Flex>
  );
};
