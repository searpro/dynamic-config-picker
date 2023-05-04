// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = `<h1>JS Starter</h1><p>Check console for output`;

// Endpoint MAP
const endpoints = {
  v1: {
    login: `NODE_BASEURL/login`,
    forgotPasswordRequest: `NODE_BASEURL/forgotPasswordToken`,
    resetPasswordWithforgotPwToken: `NODE_BASEURL/forgotPassword`,
    resetPasswordWithOldPw: `BASE_URL/customer/v1/resetPassword`,
  },
  v2: {
    login: `NODE_BASEURL/v2/user/login`,
    forgotPasswordRequest: `NODE_BASEURL/v2/user/forgot-password`,
    resetPasswordWithforgotPwToken: `NODE_BASEURL/org-user/v2/forgotPassword`,
    resetPpasswordWitholdPwToken: `BASE_URL/org-user/v2/resetPassword`,
  },
};

//App Configuration
const envConfig = {
  baseUrl: 'http://api-gateway.example.com',
  NodeBaseUrl: 'http://bff.example.com',
  apiVersion: 'v2',
};

//Endpoint selector factory
const API_FACTORY = (envConfig) => {
  const baseUrl = envConfig.baseUrl;
  const NodeBaseUrl = envConfig.NodeBaseUrl;
  class endpointDs {
    epArray = [];
    endpoints = {};
    endpoint = (version, resource, trim = true) => {
      const eI = this.epArray.findIndex((eA) => {
        return eA.version === version && eA.resource === resource;
      });
      const ep = this.epArray[eI];
      if (trim) return ep.value;
      return {
        [ep.version]: {
          [ep.resource]: ep.value,
        },
      };
    };
    add(version, resource, value) {
      const obj = {
        version: version,
        resource: resource,
        value: value,
      };
      this.epArray.push(obj);
    }
  }
  const endpointList = new endpointDs();

  for (let version in endpoints) {
    for (let resource in endpoints[version]) {
      if (endpoints[version][resource].includes('BASE_URL')) {
        endpointList.add(
          version,
          resource,
          endpoints[version][resource].replace('BASE_URL', baseUrl)
        );
      }
      if (endpoints[version][resource].includes('NODE_BASEURL')) {
        endpointList.add(
          version,
          resource,
          endpoints[version][resource].replace('NODE_BASEURL', NodeBaseUrl)
        );
      }
    }
  }

  return {
    getEndpointUrl: (resource, trim = true) => {
      if (!resource) {
        console.log('Available resources', endpointList.epArray);
        throw new Error('Resource name is required');
      }
      const version = envConfig.apiVersion ? envConfig.apiVersion : 'v1';
      return endpointList.endpoint(version, resource, trim);
    },
  };
};

const api = API_FACTORY(envConfig);

console.log(api.getEndpointUrl('resetPasswordWithforgotPwToken', false));
