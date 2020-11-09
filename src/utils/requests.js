import axios from 'axios';

export const baseURL = 'https://whot-api.dev.intelia.io/';

export default class Request {
  constructor(resource) {
    this.resource = resource;
    this.axios = axios.create({
      baseURL,
      timeout: 500000
    });
  }

  post = (data, authRequest, otherHeaders = {}) => {
    const resource = this.resource;
    const authorization =
      authRequest && `Bearer ${localStorage.getItem('jwt')}`;
    const headers = {
      ...otherHeaders,
      authorization
    };

    const config = { headers };
    return this.axios.post(resource, data, config);
  };

  patchById = (id, data, additionalPath = '', headersConfig = {}) => {
    const resource = `${this.resource}/${id}${additionalPath}`;
    const config = {
      headers: {
        ...headersConfig,
        authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    };
    return this.axios.patch(resource, data, config);
  };

  get = (queryParams, authRequest, extendedRoute) => {
    const resource = extendedRoute
      ? `${this.resource}${extendedRoute}`
      : this.resource;
    const config = {
      params: queryParams,
      headers: authRequest
        ? { authorization: `Bearer ${localStorage.getItem('jwt')}` }
        : null
    };
    return this.axios.get(resource, config);
  };

  getById = (id, queryParams, additionalPath = '') => {
    const resource = `${this.resource}/${id}${additionalPath}`;
    const config = {
      params: queryParams,
      headers: { authorization: `Bearer ${localStorage.getItem('jwt')}` }
    };
    return this.axios.get(resource, config);
  };

  deleteById = id => {
    const resource = `${this.resource}/${id}`;
    const config = {
      headers: { authorization: `Bearer ${localStorage.getItem('jwt')}` }
    };
    return this.axios.delete(resource, config);
  };
}

export const getRequestError = (error, logOut) => {
  const { response } = error;

  if (logOut && response && response.data.code === 401) {
    logOut();
    return '';
  } else if (response && response.data.errors && response.data.errors[0]) {
    return response.data.errors[0].message;
  } else if (response && response.data.message) {
    return response.data.message;
  }

  return 'an error occurred';
};
