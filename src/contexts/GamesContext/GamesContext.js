import React, { Component } from 'react';

import { games, tournaments } from './resources';
import { getRequestError } from '../../utils/requests';

const GamesContext = React.createContext();
class GamesProvider extends Component {
  state = {};

  createGame = data => {
    this.resetGameError();
    this.resetGameSuccess();
    this.setState({ gameLoading: true });

    games
      .post(data, true)
      .then(() => {
        this.setState({
          gameSuccess: true,
          gameLoading: false
        });
      })
      .catch(error => {
        this.setState({
          gameError: getRequestError(error),
          gameLoading: false
        });
      });
  };

  updateGame = (id, data) => {
    this.resetGameError();
    this.resetGameSuccess();
    this.setState({ gameLoading: true });

    games
      .patchById(id, data)
      .then(() => {
        this.setState({
          gameSuccess: true,
          gameLoading: false
        });
      })
      .catch(error => {
        this.setState({
          gameError: getRequestError(error),
          gameLoading: false
        });
      });
  };

  createTournament = data => {
    this.resetGameError();
    this.resetGameSuccess();
    this.setState({ gameLoading: true });

    tournaments
      .post(data, true)
      .then(() => {
        this.setState({
          gameSuccess: true,
          gameLoading: false
        });
      })
      .catch(error => {
        this.setState({
          gameError: getRequestError(error),
          gameLoading: false
        });
      });
  };

  updateTournament = (id, data) => {
    this.resetGameError();
    this.resetGameSuccess();
    this.setState({ gameLoading: true });

    tournaments
      .patchById(id, data)
      .then(() => {
        this.setState({
          gameSuccess: true,
          gameLoading: false
        });
      })
      .catch(error => {
        this.setState({
          gameError: getRequestError(error),
          gameLoading: false
        });
      });
  };

  getGame = (id, callback) => {
    games
      .getById(id)
      .then(({ data }) => {
        this.setState({ gameLoading: false }, () => callback(data));
      })
      .catch(error => {
        this.setState({
          gameError: getRequestError(error),
          gameLoading: false
        });
      });
  };

  deleteGame = id => {
    this.resetGameError();
    this.resetGameSuccess();
    this.setState({ gameLoading: true });

    games
      .deleteById(id)
      .then(() => {
        this.setState({
          deleteGameSuccess: true,
          gameLoading: false
        });
      })
      .catch(error => {});
  };

  resetGameSuccess = () => {
    this.setState({
      gameSuccess: false,
      deleteGameSuccess: false
    });
  };

  resetGameError = () => {
    this.setState({
      gameError: null
    });
  };

  render() {
    return (
      <GamesContext.Provider
        value={{
          ...this.state,
          resetGameSuccess: this.resetGameSuccess,
          createGame: this.createGame,
          updateGame: this.updateGame,
          getGame: this.getGame,
          createTournament: this.createTournament,
          updateTournament: this.updateTournament,
          deleteGame: this.deleteGame,
          resetGameError: this.resetGameError
        }}
      >
        {this.props.children}
      </GamesContext.Provider>
    );
  }
}

const GamesConsumer = Component => {
  return class Consumer extends React.Component {
    render() {
      return (
        <GamesContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </GamesContext.Consumer>
      );
    }
  };
};

export default GamesContext;
export { GamesProvider, GamesConsumer };
