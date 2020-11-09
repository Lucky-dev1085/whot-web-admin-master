import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { confirmNote, confirmButton, login } from './ConfirmEmail.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import AuthLayout from '../../components/AuthLayout';
import Button from '../../components/Button';
import {
  TextInput,
  isFormValid,
  getFormValues
} from '../../components/FormControls';
import { isFullName } from '../../utils';
import Toast from '../../components/Toast';

class ConfirmEmail extends Component {
  state = {
    formFields: {
      name: { value: '', isValid: false },
      password: { value: '', isValid: false },
      passwordConfirm: { value: '', isValid: false }
    }
  };

  onSubmit = e => {
    e.preventDefault();
    const { match, resetPassword } = this.props;
    const { name, password } = getFormValues(this.state.formFields);
    const { token } = match.params;

    const userData = {
      name,
      password,
      token
    };

    resetPassword(userData);
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
    const { passwordResetError, resetAuthError } = this.props;
    passwordResetError && resetAuthError();
  }

  render() {
    const { authLoading, passwordResetError, resetAuthError } = this.props;
    const { formFields } = this.state;
    const { name, password, passwordConfirm } = formFields;

    const isValidForm = isFormValid(formFields);

    return (
      <AuthLayout>
        <p className={confirmNote}>Please set Your Name and Password</p>
        <form onSubmit={this.onSubmit}>
          <TextInput
            name="name"
            label="FULL NAME"
            value={name.value}
            required={true}
            onChange={this.onInputChange}
            validator={isFullName}
            placeholder="Enter your fullname"
          />

          <TextInput
            type="password"
            name="password"
            label="SET PASSWORD"
            value={password.value}
            required={true}
            onChange={this.onInputChange}
            placeholder="Set your password"
          />

          <TextInput
            type="password"
            name="passwordConfirm"
            label="CONFIRM PASSWORD"
            value={passwordConfirm.value}
            required={true}
            pattern={password.value}
            onChange={this.onInputChange}
            placeholder="Set your password"
          />

          <Button
            className={confirmButton}
            disabled={authLoading || !isValidForm}
            block
          >
            CONFIRM
          </Button>
        </form>

        <div className={login}>
          <Link to="/">Login Now</Link>
        </div>

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

export default UserConsumer(ConfirmEmail);
