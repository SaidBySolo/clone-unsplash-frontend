import * as Form from '@radix-ui/react-form';
import { Button, TextField, TextArea, Flex, Text, Box, Card } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { photoService } from '../../services/photo.service';

export const PhotoUploadForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      }
    },
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('No file selected');

      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      return photoService.uploadPhoto(
        file,
        formData.title,
        formData.description || undefined,
        tags.length > 0 ? tags : undefined
      );
    },
    onSuccess: (photo) => {
      // Invalidate all photo-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      queryClient.invalidateQueries({ queryKey: ['user-photos'] });
      navigate(`/photos/${photo.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Flex direction="column" gap="4">
        {/* Image Upload */}
        {!preview ? (
          <Box
            {...getRootProps()}
            style={{
              border: '2px dashed var(--gray-a7)',
              borderRadius: 'var(--radius-3)',
              padding: '3rem 2rem',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'var(--gray-a2)' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <input {...getInputProps()} />
            <Text size="4" weight="medium" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {isDragActive ? '여기에 이미지를 드롭하세요' : '이미지를 드래그 & 드롭하세요'}
            </Text>
            <Text size="2" color="gray">
              또는 클릭하여 선택 (최대 10MB)
            </Text>
          </Box>
        ) : (
          <Card style={{ position: 'relative' }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <Button
              variant="soft"
              color="red"
              style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              onClick={handleRemoveImage}
            >
              <Cross2Icon />
            </Button>
          </Card>
        )}

        {/* Form Fields */}
        <Form.Field name="title">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">제목 *</Text>
            </Form.Label>
            <Form.Message match="valueMissing">
              <Text size="1" color="red">제목은 필수입니다</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextField.Root
                placeholder="사진에 제목을 붙여주세요"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        <Form.Field name="description">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">설명</Text>
            </Form.Label>
            <Form.Message match={(value) => value.length > 1000}>
              <Text size="1" color="red">설명은 1000자 이하여야 합니다</Text>
            </Form.Message>
            <Form.Control asChild>
              <TextArea
                placeholder="설명을 추가하세요... (선택)"
                rows={4}
                maxLength={1000}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Control>
          </Flex>
        </Form.Field>

        <Form.Field name="tags">
          <Flex direction="column" gap="1">
            <Form.Label>
              <Text size="2" weight="medium">태그</Text>
            </Form.Label>
            <Form.Control asChild>
              <TextField.Root
                placeholder="자연, 풍경, 산 (쉰표로 구분)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </Form.Control>
            <Text size="1" color="gray">
              태그를 쉰표로 구분하세요
            </Text>
          </Flex>
        </Form.Field>

        {uploadMutation.isError && (
          <Text size="2" color="red">
            {uploadMutation.error instanceof Error
              ? uploadMutation.error.message
              : '업로드 실패'}
          </Text>
        )}

        <Form.Submit asChild>
          <Button
            size="3"
            disabled={!file || uploadMutation.isPending}
            style={{ width: '100%' }}
          >
            {uploadMutation.isPending ? '업로드 중...' : '사진 업로드'}
          </Button>
        </Form.Submit>
      </Flex>
    </Form.Root>
  );
};
