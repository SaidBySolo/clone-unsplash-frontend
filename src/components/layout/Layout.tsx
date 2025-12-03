import { Box } from '@radix-ui/themes';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const Layout = () => {
  return (
    <Box>
      <Header />
      <Box style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
