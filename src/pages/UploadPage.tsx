import { Container, Heading, Box } from '@radix-ui/themes';
import { PhotoUploadForm } from '../components/photo/PhotoUploadForm';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UploadPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container size="2" style={{ padding: '2rem 0' }}>
      <Box style={{ marginBottom: '2rem' }}>
        <Heading size="8" style={{ marginBottom: '0.5rem' }}>
          사진 업로드
        </Heading>
      </Box>
      <PhotoUploadForm />
    </Container>
  );
};
