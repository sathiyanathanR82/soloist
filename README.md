# Soloist - Social Login & Registration App

A modern Angular application built with social authentication (Facebook, Gmail, Yahoo, Microsoft), comprehensive registration form, and user profile management - similar to Facebook.

## 🎯 Features

- **Social Authentication**: Login with Facebook, Gmail, Yahoo, or Microsoft
- **User Registration**: Complete registration form with validation
- **Profile Management**: View and edit user profile with detailed information
- **Editable & Non-Editable Fields**:
  - Non-editable: Email, User ID (automatically generated)
  - Editable: Name, location, bio, headline, phone, website, etc.
- **Terms & Conditions**: Interactive modal with full T&C that users must agree to
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Facebook-inspired design with smooth animations
- **Data Persistence**: User data saved in localStorage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v17.x)

## 🚀 Installation & Setup

1. **Navigate to the project directory**:
   ```bash
   cd soloist
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   ng serve
   ```

4. **Open in browser**:
   Navigate to `http://localhost:4200` in your web browser.

## 📁 Project Structure

```
soloist/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/              # Social login page
│   │   │   ├── registration/       # Registration form
│   │   │   ├── profile/            # User profile page
│   │   │   ├── terms-modal/        # Terms & conditions modal
│   │   │   └── navbar/             # Navigation bar
│   │   ├── services/
│   │   │   └── auth.service.ts     # Authentication service
│   │   ├── models/
│   │   │   └── user.model.ts       # User interface definitions
│   │   ├── app.module.ts           # Root module
│   │   ├── app-routing.module.ts   # Routing configuration
│   │   ├── app.component.ts        # Root component
│   │   └── ...
│   ├── index.html                  # Main HTML file
│   ├── main.ts                     # Application entry point
│   ├── styles.scss                 # Global styles
│   └── ...
├── angular.json                    # Angular CLI configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── README.md                        # This file
```

## 🔄 User Flow

1. **Login**: User clicks on a social provider button (Facebook, etc.)
   - Mock social authentication simulates provider login
   - Creates a user session with basic info from social provider

2. **Registration**: After login, user is directed to registration form
   - Pre-filled with data from social provider (first name, last name, email)
   - Email and User ID are disabled/non-editable
   - User completes additional information (phone, location, bio, etc.)
   - Must agree to Terms & Conditions (opens modal)
   - Clicks "Complete Registration" button

3. **Profile**: After successful registration
   - User is redirected to profile page
   - All user details are displayed in a clean, organized format
   - User can edit profile information (except email and user ID)
   - Changes are saved and persisted in localStorage

## 🔐 Authentication

Currently, the app uses mock authentication for demonstration purposes. To integrate with real OAuth providers, you would need to:

1. Register your application with each social provider
2. Install OAuth2 library: `npm install angular-oauth2-oidc`
3. Configure OAuth settings in `auth.service.ts`
4. Update login methods to use real authentication endpoints

Example providers:
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/web/)
- [Google Sign-In](https://developers.google.com/identity)
- [Microsoft Identity](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Yahoo OAuth](https://developer.yahoo.com/oauth2/guide/)

## 🎨 Customization

### Colors and Theme
Edit `src/styles.scss` and component `.scss` files to customize colors:
- Primary Color: `#667eea`
- Secondary Color: `#764ba2`
- Background: `#f0f2f5`

### Form Fields
Modify the registration form in `registration.component.html` and `.ts` file to add or remove fields.

### Terms & Conditions
Update the content in `terms-modal.component.ts` in the `termsContent` property.

## 📱 Responsive Design

The application is fully responsive and tested for:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 💾 Data Persistence

User data is stored in browser's localStorage as `currentUser` key. To clear data:
```javascript
localStorage.removeItem('currentUser');
```

To export all user data:
```javascript
const userData = JSON.parse(localStorage.getItem('currentUser'));
console.log(userData);
```

## 🧪 Testing

To run unit tests:
```bash
npm test
```

To build for production:
```bash
npm run build
```

## 📝 Form Validation

### Registration Form Validations:
- **First Name/Last Name**: Required, minimum 2 characters
- **Email**: Non-editable, required
- **Phone**: Optional, must match phone number pattern
- **Website**: Optional, must be valid URL format
- **Bio**: Optional, maximum 500 characters
- **Date of Birth**: Required
- **Gender**: Required
- **Terms & Conditions**: Must be accepted

## 🚀 Deployment

To deploy the application:

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service**:
   - Firebase Hosting
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

Example for Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

## 🐛 Troubleshooting

**Issue**: Application not loading
- Clear browser cache: Ctrl+Shift+Delete
- Check browser console for errors: F12 -> Console tab
- Ensure Angular CLI is installed: `npm install -g @angular/cli`

**Issue**: Form validation not working
- Check that ReactiveFormsModule is imported in app.module.ts
- Verify form validators in component `.ts` file

**Issue**: Data not persisting
- Check localStorage is enabled in browser
- Verify localStorage key: `localStorage.getItem('currentUser')`

## 📚 Technologies Used

- **Angular 17**: Frontend framework
- **TypeScript**: Programming language
- **SCSS**: Styling
- **Reactive Forms**: Form handling and validation
- **RxJS**: Reactive programming
- **LocalStorage**: Data persistence

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using Angular**