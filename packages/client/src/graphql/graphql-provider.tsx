import React, { FC, useEffect } from 'react';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';
import { useSettings } from '@context/setting.context';

const uri = `${import.meta.env.VITE_BACKEND_URL}/graphql`;

export interface GraphqlProviderProps {
  children: React.ReactNode;
}

export const GraphqlProvider: FC<GraphqlProviderProps> = ({ children }) => {
  const { settings } = useSettings();
  const [httpLink, setHttpLink] = React.useState<HttpLink>(
    new HttpLink({
      uri: uri,
      fetch: fetch
    })
  );

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
