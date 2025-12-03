import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export const useFollow = (userId: number) => {
  const queryClient = useQueryClient();

  const { data: isFollowing } = useQuery({
    queryKey: ['follow', userId],
    queryFn: () => userService.isFollowing(userId),
  });

  const followMutation = useMutation({
    mutationFn: () => userService.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => userService.unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    isFollowing: isFollowing || false,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
};
