import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store, { persistor } from './app/store'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from "redux-persist/integration/react";
import { SocketContextProvider } from './context/socket';
import { NotificationProvider } from './context/NotificationContext';
const clientId = import.meta.env.VITE_CLIENTID; 


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(

  <Provider store={store} >
      <GoogleOAuthProvider clientId={clientId}>
      <NotificationProvider>
      <PersistGate loading={null} persistor={persistor}>
      <SocketContextProvider>

          <App />
          </SocketContextProvider>

          </PersistGate>
          </NotificationProvider>

          </GoogleOAuthProvider>
    </Provider>

);
