// This file can be replaced during build by using the `fileReplacements` array
// in `angular.json` when `ng build` is invoked with one of these configurations
// for example:
// `ng build --configuration development`

// Replace with your environment configuration
export const environment = {
  production: false,
  // apiUrl: 'http://localhost:1000010000/api',
  apiUrl: 'https://soloist-backend-pxhl.onrender.com/api',
  socialProviders: {
    facebook: {
      appId: 'YOUR_FACEBOOK_APP_ID',
      version: 'v18.0'
    },
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID'
    },
    microsoft: {
      clientId: 'YOUR_MICROSOFT_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/common'
    },
    yahoo: {
      clientId: 'YOUR_YAHOO_CLIENT_ID'
    }
  }
};
