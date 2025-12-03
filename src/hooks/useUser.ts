import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => userService.getUserByUsername(username),
  });
};
