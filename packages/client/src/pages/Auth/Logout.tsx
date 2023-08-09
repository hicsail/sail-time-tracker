import { Paths } from '@constants/paths';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@components/loading-screen';

export const Logout: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const keysToRemove = ['settings', 'token'];

    for (let key of keysToRemove) {
      localStorage.removeItem(key);
    }

    navigate(Paths.LOGIN, { replace: true });
  }, []);

  return <LoadingScreen />;
};
