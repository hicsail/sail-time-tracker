import { useEffect } from 'react';
import { Paths } from '@constants/paths';

export const Login = () => {
  const loginUrl = import.meta.env.VITE_AUTH_CLIENT;
  const projectId = import.meta.env.VITE_PROJECT_ID;

  useEffect(() => {
    window.location.replace(`${loginUrl}?projectId=${projectId}&redirectUrl=${encodeURIComponent(window.location.origin + Paths.AUTH_CALLBACK)}`);
  }, []);

  return null;
};
