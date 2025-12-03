import * as Form from '@radix-ui/react-form';
import { Button, TextField, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import type { RegisterRequest } from '../../types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm = ({ onSuccess, onSwitchToLogin }: RegisterFormProps) => {
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await register(formData);
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
            <Form.Message match={(value) => value.length < 3}>
              <Text size="1" color="red">사용자명은 최소 3자 이상이어야 합니다</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                placeholder="사용자명 선택"
                required
                minLength={3}
                maxLength={50}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        <Form.Field name="email">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">이메일</Text>
            </Form.Label>
            <Form.Message match="valueMissing">
              <Text size="1" color="red">이메일을 입력하세요</Text>
            </Form.Message>
            <Form.Message match="typeMismatch">
              <Text size="1" color="red">유효한 이메일을 입력하세요</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <Form.Message match={(value) => value.length < 6}>
              <Text size="1" color="red">비밀번호는 최소 6자 이상이어야 합니다</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                type="password"
                placeholder="비밀번호 선택"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        <Form.Field name="name">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">이름 (선택)</Text>
            </Form.Label>
            <Form.Control asChild>
              <TextField.Root
                placeholder="이름"
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        {error && (
          <Text size="2" color="red">{error}</Text>
        )}

        <Form.Submit asChild>
          <Button disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? '계정 생성 중...' : '회원가입'}
          </Button>
        </Form.Submit>

        {onSwitchToLogin && (
          <Flex justify="center" gap="2">
            <Text size="2" color="gray">이미 계정이 있으신가요?</Text>
            <Text
              size="2"
              style={{ cursor: 'pointer', color: 'var(--accent-9)' }}
              onClick={onSwitchToLogin}
            >
              로그인
            </Text>
          </Flex>
        )}
      </Flex>
    </Form.Root>
  );
};
