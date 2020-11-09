import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { signInForm, forgotPassword } from './SignIn.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import {
  EmailInput,
  TextInput,
  isFormValid,
  getFormValues
} from '../../components/FormControls';
import Toast from '../../components/Toast';

class Login extends Component {
  state = {
    formFields: {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false }
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = getFormValues(this.state.formFields);

    this.props.signIn(userData);
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
    const { signInError, resetAuthError } = this.props;
    signInError && resetAuthError();
  }

  render() {
    const {
      authLoading,
      signInError,
      inactivity,
      userLogout,
      resetAuthError
    } = this.props;
    const { formFields } = this.state;
    const { email, password } = formFields;

    const isValidForm = isFormValid(formFields);

    return (
      <AuthLayout>
        <form className={signInForm} onSubmit={this.onSubmit}>
          <EmailInput
            name="email"
            label="EMAIL ADDRESS"
            value={email.value}
            required={true}
            onChange={this.onInputChange}
            placeholder="Enter your email address"
          />

          <TextInput
            type="password"
            name="password"
            label="PASSWORD"
            value={password.value}
            required={true}
            onChange={this.onInputChange}
            placeholder="Enter your Password"
          />

          <div className={forgotPassword}>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <Button disabled={authLoading || !isValidForm} block>
            SIGN IN
          </Button>
        </form>

        {signInError && (
          <Toast type="error" message={signInError} close={resetAuthError} />
        )}

        {inactivity && (
          <Toast
            duration={0}
            type="logout"
            message="For your privacy, we logged you out after 10 minutes of inactivity."
            close={resetAuthError}
          />
        )}

        {!inactivity && userLogout && (
          <Toast
            type="logout"
            message="You have logged out successfully."
            close={resetAuthError}
          />
        )}
      </AuthLayout>
    );
  }
}

export default UserConsumer(Login);
