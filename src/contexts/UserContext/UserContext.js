import React, { Component } from 'react';

import { users, signIn, passwordReset, playerDetails } from './resources';
import { getRequestError } from '../../utils/requests';

const UserContext = React.createContext();
class UserProvider extends Component {
  constructor() {
    super();

    this.state = {
      user: this.getInitialUser()
    };
  }

  getInitialUser = () => {
    let user = null;

    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      return null;
    }

    return user;
  };

  signIn = userData => {
    this.resetAuthError();
    this.setState({ authLoading: true });

    signIn
      .post(userData)
      .then(({ data }) => {
        const { permissions } = data.user;
        if (
          !permissions.length ||
          !(permissions.includes('*') || permissions.includes('admin-app:read'))
        ) {
          this.setState({
            signInError: `This account doesn't exist.`,
            authLoading: false
          });

          return;
        }

        this.saveUser(data);
        this.setState({ authLoading: false });
      })
      .catch(error => {
        this.setState({
          signInError: getRequestError(error),
          authLoading: false
        });
      });
  };

  saveUser = data => {
    const { jwt, user } = data;

    localStorage.setItem('jwt', jwt);
    localStorage.setItem('user', JSON.stringify(user));

    this.setState({ user });
  };

  initiatePasswordReset = email => {
    this.resetAuthError();
    this.resetAuthSuccess();
    this.setState({ authLoading: true });

    passwordReset
      .get({ email })
      .then(() => {
        this.setState({
          authLoading: false,
          passwordResetSuccess: true
        });
      })
      .catch(error => {
        this.setState({
          passwordResetError: getRequestError(error),
          authLoading: false
        });
      });
  };

  resetPassword = userData => {
    this.resetAuthError();
    this.setState({ authLoading: true });

    passwordReset
      .post(userData)
      .then(({ data }) => {
        this.saveUser(data);
        this.setState({ authLoading: false });
      })
      .catch(error => {
        this.setState({
          passwordResetError: getRequestError(error),
          authLoading: false
        });
      });
  };

  createUser = userData => {
    this.resetAuthError();
    this.resetAuthSuccess();
    this.setState({ authLoading: true });

    users
      .post(userData, true)
      .then(() => {
        this.setState({
          profileSuccess: true,
          authLoading: false
        });
      })
      .catch(error => {
        this.setState({
          profileError: getRequestError(error),
          authLoading: false
        });
      });
  };

  updateUser = (id, userData) => {
    this.resetAuthError();
    this.resetAuthSuccess();
    this.setState({ authLoading: true });

    users
      .patchById(id, userData)
      .then(() => {
        this.setState({
          profileSuccess: true,
          authLoading: false
        });
      })
      .catch(error => {
        this.setState({
          profileError: getRequestError(error),
          authLoading: false
        });
      });
  };

  deleteUser = id => {
    this.resetAuthError();
    this.resetAuthSuccess();
    this.setState({ authLoading: true });

    users
      .deleteById(id)
      .then(() => {
        this.setState({
          deleteUserSuccess: true,
          authLoading: false
        });
      })
      .catch(error => {});
  };

  updatePlayer = (id, userData) => {
    this.resetAuthError();
    this.resetAuthSuccess();
    this.setState({ authLoading: true });

    playerDetails
      .patchById(id, userData)
      .then(() => {
        this.setState({
          profileSuccess: true,
          authLoading: false
        });
      })
      .catch(error => {
        this.setState({
          profileError: getRequestError(error),
          authLoading: false
        });
      });
  };

  logout = () => {
    this.setState({
      user: null,
      userLogout: true
    });

    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  onInactive = () => {
    this.setState({ inactivity: true });
    this.logout();
  };

  resetAuthSuccess = () => {
    this.setState({
      passwordResetSuccess: false,
      profileSuccess: false,
      deleteUserSuccess: false
    });
  };

  resetAuthError = () => {
    this.setState({
      signInError: null,
      passwordResetError: null,
      profileError: null,
      inactivity: false,
      userLogout: false
    });
  };

  componentDidMount() {
    //fetch user profile
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          signIn: this.signIn,
          initiatePasswordReset: this.initiatePasswordReset,
          resetPassword: this.resetPassword,
          resetAuthSuccess: this.resetAuthSuccess,
          createUser: this.createUser,
          updateUser: this.updateUser,
          deleteUser: this.deleteUser,
          updatePlayer: this.updatePlayer,
          resetAuthError: this.resetAuthError,
          logout: this.logout,
          onInactive: this.onInactive
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

const UserConsumer = Component => {
  return class Consumer extends React.Component {
    render() {
      return (
        <UserContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </UserContext.Consumer>
      );
    }
  };
};

export default UserContext;
export { UserProvider, UserConsumer };
