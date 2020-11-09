import GamesList from './GamesList';
import CreateGame from './CreateGame';
import EditGame from './EditGame';

export const ROUTES = [
  {
    path: '/games',
    component: GamesList
  },
  {
    path: '/games/new',
    component: CreateGame
  },
  {
    path: '/games/:id',
    component: EditGame
  }
];

export const PLAYERS_OPTIONS = Array(4)
  .fill(0)
  .map((x, i) => ({ value: i + 2, label: i + 2 }));

export const DEFAULT_CREATE_FORM_FIELDS = {
  tableTitle: { value: '', isValid: false },
  minStakeAmount: { value: '', isValid: false },
  maxPlayerCount: { value: '', isValid: false },
  stakeAmount: { value: '', isValid: true },
  startDate: { value: null, isValid: true },
  startTime: { value: null, isValid: true },
  featured: { value: false, isValid: true }
};
