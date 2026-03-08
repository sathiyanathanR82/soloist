# Quick Start Guide - Soloist Angular App

## Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```
This will install all required packages including Angular, TypeScript, and form libraries.

### 2. Start Development Server
```bash
npm start
```
or
```bash
ng serve
```

### 3. Open in Browser
Navigate to: `http://localhost:4200`

You should see the Soloist login page with social login buttons.

---

## 📱 Testing the Application

### Step 1: Login with Social Provider
1. Click any social provider button (Facebook, LinkedIn, Gmail, Yahoo, or Microsoft)
2. The app will simulate a social login
3. You'll see a loading animation
4. You'll be redirected to the registration page

### Step 2: Complete Registration
1. Review the pre-filled information from social login
2. Email and User ID are **non-editable** (grayed out)
3. Fill in the additional details:
   - First Name (required)
   - Last Name (required)
   - Date of Birth (required)
   - Gender (required)
   - Phone (optional)
   - Location (optional)
   - Professional Headline (optional)
   - Bio (optional - max 500 chars)
   - Website (optional - must be valid URL)

4. **Important**: Check the "I agree to Terms and Conditions" checkbox
5. Click on the Terms link to view the full terms in a modal
6. Click "I Agree to Terms" button in the modal
7. Click "Complete Registration" button

### Step 3: View User Profile
1. After successful registration, you'll be redirected to the profile page
2. You'll see:
   - User avatar with initials
   - All personal information in organized sections
   - Profile completion percentage
   - Edit Profile button

### Step 4: Edit Profile
1. Click "Edit Profile" button
2. You can edit most fields (except Email and User ID)
3. Make your changes
4. Click "Save Changes" button
5. The profile will update and display the success message

### Step 5: Logout
1. Click on your avatar in the top-right corner (navbar)
2. Select "Logout" from the dropdown
3. You'll be redirected to the login page

---

## 📂 File Structure Overview

### Components
- **login**: Social login page with 5 provider buttons
- **registration**: Registration form with validation
- **profile**: User profile page with edit capability
- **terms-modal**: Terms and conditions popup
- **navbar**: Navigation header with user menu

### Services
- **auth.service.ts**: Handles authentication, registration, profile updates, and localStorage

### Models
- **user.model.ts**: TypeScript interfaces for User, AuthResponse, etc.

---

## 🔍 Key Features Explained

### 1. Non-Editable Fields
- **Email**: Set from social login, cannot be changed
- **User ID**: Auto-generated, immutable

### 2. Form Validation
- Real-time field validation
- Error messages appear below invalid fields
- Submit button disabled until all validations pass

### 3. Terms & Conditions
- Click the link to open a modal
- Must read and click "I Agree" to accept
- Checkbox is required to complete registration

### 4. Data Persistence
- All data saved to browser localStorage
- Survives page refresh
- Clear with: `localStorage.removeItem('currentUser')`

### 5. Responsive Design
- Mobile: Single column layout
- Tablet: 2-column form layout
- Desktop: Full width with optimal spacing

---

## 🛠️ Development Tips

### Modifying Form Fields
Edit `src/app/components/registration/registration.component.ts`:
```typescript
registrationForm = this.fb.group({
  // Add new fields here
});
```

### Changing Colors
Edit `src/styles.scss`:
```scss
// Change primary color from #667eea to your color
--primary-color: #your-color;
```

### Adding Real OAuth
1. Install: `npm install angular-oauth2-oidc`
2. Update `auth.service.ts` with real OAuth configuration
3. Replace mock login methods with real provider APIs

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Blank page | Clear cache (Ctrl+Shift+Delete), restart dev server |
| Form won't submit | Check browser console for validation errors |
| Data lost on refresh | Ensure localStorage is enabled in browser |
| Styling looks wrong | Run `npm start` again or clear browser cache |
| Build errors | Delete `node_modules` and `dist`, run `npm install` again |

---

## 📊 Project Statistics

- **Components**: 5
- **Services**: 1
- **Models/Interfaces**: 3
- **Lines of Code**: ~1500+
- **Responsive Breakpoints**: 3 (mobile, tablet, desktop)

---

## 🚀 Next Steps

1. **Integrate Real OAuth**: Replace mock authentication with real social providers
2. **Add Backend API**: Connect to a backend server instead of localStorage
3. **Add More Forms**: Extend registration with additional fields
4. **Customize Styling**: Update colors and fonts to match your brand
5. **Add Email Verification**: Send verification emails after registration
6. **Add Password Management**: Implement password reset functionality

---

## 📚 Useful Resources

- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [SCSS Guide](https://sass-lang.com/guide)

---

## 💡 Tips for Production

1. Run `npm run build` to create optimized production build
2. Minified files in `dist/` folder
3. Deploy to Firebase, Vercel, Netlify, or AWS
4. Always use HTTPS in production
5. Implement proper error handling
6. Add logging for debugging
7. Test on multiple browsers and devices

---

**Happy coding! 🎉**
