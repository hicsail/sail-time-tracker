import { FC, useEffect } from 'react';
import { useAuth } from '@summerluna/harbor';
import { Paths } from '@constants/paths';
import { Outlet, useNavigate } from 'react-router-dom';

export const TrackGuard = () => {
  const { token, decoded_token, initialized } = useAuth();
  const loginUrl = import.meta.env.VITE_AUTH_CLIENT;
  const projectId = import.meta.env.VITE_PROJECT_ID;

  useEffect(() => {
    if (initialized && !token) {
      window.location.replace(`${loginUrl}?projectId=${projectId}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`);
    }
  }, [initialized, token, decoded_token]);

  return <Outlet />;
};
