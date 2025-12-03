import * as Form from '@radix-ui/react-form';
import { Button, TextField, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { LoginRequest } from '../../types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm = ({ onSuccess, onSwitchToRegister }: LoginFormProps) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(formData);
      onSuccess?.();
    } catch (err) {
      // Error is already set in the store
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Flex direction="column" gap="4">
        <Form.Field name="username">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">사용자명</Text>
            </Form.Label>
            <Form.Message match="valueMissing">
              <Text size="1" color="red">사용자명을 입력하세요</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                placeholder="사용자명 입력"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        <Form.Field name="password">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">비밀번호</Text>
            </Form.Label>
            <Form.Message match="valueMissing">
              <Text size="1" color="red">비밀번호를 입력하세요</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                type="password"
                placeholder="비밀번호 입력"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        {error && (
          <Text size="2" color="red">{error}</Text>
        )}

        <Form.Submit asChild>
          <Button disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </Form.Submit>

        {onSwitchToRegister && (
          <Flex justify="center" gap="2">
            <Text size="2" color="gray">계정이 없으신가요?</Text>
            <Text
              size="2"
              style={{ cursor: 'pointer', color: 'var(--accent-9)' }}
              onClick={onSwitchToRegister}
            >
              회원가입
            </Text>
          </Flex>
        )}
      </Flex>
    </Form.Root>
  );
};
