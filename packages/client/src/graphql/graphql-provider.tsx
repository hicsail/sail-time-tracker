import React, { FC, useEffect } from 'react';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';
import { useSettings } from '@context/setting.context';
import { LoadingScreen } from '@components/loading-screen';

export interface GraphqlProviderProps {
  children: React.ReactNode;
}

export const GraphqlProvider: FC<GraphqlProviderProps> = ({ children }) => {
  const { settings } = useSettings();
  const [httpLink, setHttpLink] = React.useState<HttpLink>();

  useEffect(() => {
    if (settings?.VITE_BACKEND_URL) {
      setHttpLink(
        new HttpLink({
          uri: settings.VITE_BACKEND_URL,
          fetch: fetch
        })
      );
    }
  }, [settings]);

  if (!httpLink) {
    return <LoadingScreen />;
  }

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache({
      resultCaching: true
    }),
    link: from([httpLink]),
    defaultOptions: {
      query: {
        errorPolicy: 'ignore',
        returnPartialData: true
      }
    }
  });
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
