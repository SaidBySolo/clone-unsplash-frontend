import { Box, Container, Flex, TextField, Button, DropdownMenu, Avatar } from '@radix-ui/themes';
import { MagnifyingGlassIcon, PersonIcon } from '@radix-ui/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { AuthDialog } from '../auth/AuthDialog';

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const openLoginDialog = () => {
    setAuthMode('login');
    setAuthDialogOpen(true);
  };

  const openRegisterDialog = () => {
    setAuthMode('register');
    setAuthDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Box style={{ borderBottom: '1px solid var(--gray-a5)', padding: '1rem 0' }}>
        <Container>
          <Flex justify="between" align="center" gap="4">
            <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--gray-12)' }}>
              Unsplash
            </Link>

            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px' }}>
              <TextField.Root
                placeholder="사진 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </form>

            <Flex gap="3" align="center">
              <Link to="/collections" style={{ textDecoration: 'none', color: 'var(--gray-12)' }}>
                컬렉션
              </Link>

              {isAuthenticated ? (
                <>
                  <Link to="/upload">
                    <Button variant="soft">업로드</Button>
                  </Link>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <button
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        <Avatar
                          size="2"
                          fallback={<PersonIcon />}
                          radius="full"
                        />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item onClick={() => navigate(`/users/${localStorage.getItem('username') || 'me'}`)}>
                        프로필
                      </DropdownMenu.Item>
                      <DropdownMenu.Item onClick={() => navigate('/upload')}>
                        사진 업로드
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item color="red" onClick={handleLogout}>
                        로그아웃
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={openLoginDialog}>
                    로그인
                  </Button>
                  <Button onClick={openRegisterDialog}>
                    회원가입
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </Container>
      </Box>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode={authMode}
      />
    </>
  );
};
