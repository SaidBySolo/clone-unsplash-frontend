import { Button } from '@radix-ui/themes';
import { useFollow } from '../../hooks/useFollow';
import { useAuthStore } from '../../store/authStore';

interface FollowButtonProps {
  userId: number;
}

export const FollowButton = ({ userId }: FollowButtonProps) => {
  const { isAuthenticated } = useAuthStore();
  const { isFollowing, follow, unfollow, isLoading } = useFollow(userId);

  if (!isAuthenticated) {
    return null;
  }

  const handleClick = () => {
    if (isFollowing) {
      unfollow();
    } else {
      follow();
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'solid'}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};
