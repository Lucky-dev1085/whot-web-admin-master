import React from 'react';

import './App.sass';
import { UserProvider } from './contexts/UserContext';
import AppLayout from './layouts/AppLayout';

const App = () => (
  <UserProvider>
    <AppLayout />
  </UserProvider>
);

export default App;
