import React from 'react';

import { GamesProvider } from '../../contexts/GamesContext';
import AdminLayout from '../AdminLayout';
import { ROUTES as routes } from './Games.constants';

const Games = () => (
  <GamesProvider>
    <AdminLayout routes={routes} />
  </GamesProvider>
);

export default Games;
