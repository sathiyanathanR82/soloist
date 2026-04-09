export const environment = {
  production: true,
  // IMPORTANT: When you deploy your backend to a real domain, 
  // replace 'localhost:10000' with your real API URL (e.g., https://api.yourdomain.com/api)
  apiUrl: 'http://localhost:10000/api',
  socialProviders: {
    facebook: {
      appId: 'YOUR_PRODUCTION_FACEBOOK_APP_ID',
      version: 'v18.0'
    },
    google: {
      clientId: 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID'
    },
    microsoft: {
      clientId: 'YOUR_PRODUCTION_MICROSOFT_CLIENT_ID',
      authority: 'https://login.microsoftonline.com/common'
    },
    yahoo: {
      clientId: 'YOUR_PRODUCTION_YAHOO_CLIENT_ID'
    }
  }
};
