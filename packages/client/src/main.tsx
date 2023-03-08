import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GraphqlProvider } from '@graphql/graphql-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GraphqlProvider>
      <App />
    </GraphqlProvider>
  </React.StrictMode>
);
