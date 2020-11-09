import { Component } from 'react';

import { UserConsumer } from '../../contexts/UserContext';
import {
  EVENTS as events,
  INACTIVITY_TIME as inactivityTime
} from './ActivityWatch.constants';

class ActivityWatch extends Component {
  state = { logginStatus: true };

  setTimeout = () => {
    this.logoutTimeout = setTimeout(this.logout, inactivityTime);
  };

  clearTimeout = () => {
    this.logoutTimeout && clearTimeout(this.logoutTimeout);
  };

  resetTimeout = () => {
    this.clearTimeout();
    this.setTimeout();
  };

  logout = () => {
    this.props.onInactive(true);
  };

  componentWillUnmount() {
    this.clearTimeout();
    events.forEach(evt => window.removeEventListener(evt, this.resetTimeout));
  }

  componentDidMount() {
    events.forEach(evt => window.addEventListener(evt, this.resetTimeout));
    this.setTimeout();
  }

  render() {
    return null;
  }
}

export default UserConsumer(ActivityWatch);
