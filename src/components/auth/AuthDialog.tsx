import { Dialog, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthDialog = ({ open, onOpenChange, defaultMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="450px">
        <Flex direction="column" gap="4">
          <Flex justify="between" align="center">
            <Dialog.Title>
              <Heading size="6">
                {mode === 'login' ? '로그인' : '회원가입'}
              </Heading>
            </Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
                <Cross2Icon width={20} height={20} />
              </IconButton>
            </Dialog.Close>
          </Flex>

          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setMode('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
