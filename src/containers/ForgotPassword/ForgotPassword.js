import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { resetDetails, resetButton, login } from './ForgotPassword.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import { EmailInput } from '../../components/FormControls';
import Toast from '../../components/Toast';

class ForgotPassword extends Component {
  state = {
    formFields: {
      email: { value: '', isValid: false }
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const email = this.state.formFields.email.value;
    this.props.initiatePasswordReset(email);
  };

  onInputChange = (name, value, isValid) => {
    const formFields = {
      ...this.state.formFields,
      [name]: { value, isValid }
    };

    this.setState({ formFields });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    const {
      passwordResetError,
      passwordResetSuccess,
      resetAuthError,
      resetAuthSuccess
    } = this.props;
    passwordResetError && resetAuthError();
    passwordResetSuccess && resetAuthSuccess();
  }

  render() {
    const {
      authLoading,
      passwordResetError,
      resetAuthError,
      passwordResetSuccess,
      resetAuthSuccess
    } = this.props;
    const { formFields } = this.state;
    const { email } = formFields;

    return (
      <AuthLayout>
        <p className={resetDetails}>
          Enter the email address associated with your account
        </p>
        <form onSubmit={this.onSubmit}>
          <EmailInput
            name="email"
            label="EMAIL ADDRESS"
            value={email.value}
            required={true}
            onChange={this.onInputChange}
            placeholder="Enter your email address"
          />

          <Button
            className={resetButton}
            disabled={authLoading || !email.isValid}
            block
          >
            SEND RESET LINK
          </Button>
        </form>

        <div className={login}>
          <Link to="/">Login Now</Link>
        </div>

        {passwordResetSuccess && (
          <Toast
            message="Your password has been reset successfully"
            close={resetAuthSuccess}
          />
        )}

        {passwordResetError && (
          <Toast
            type="error"
            message={passwordResetError}
            close={resetAuthError}
          />
        )}
      </AuthLayout>
    );
  }
}

export default UserConsumer(ForgotPassword);
