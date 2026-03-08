# 🚀 Installation & Setup Instructions

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v14.20.0 or higher
- **npm**: v6.0.0 or higher
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Check Your Versions

```bash
node --version    # Should be v14+ or higher
npm --version     # Should be v6+ or higher
git --version     # Should be installed
```

---

## 5-Minute Quick Setup

### Step 1: Navigate to Project Directory
```bash
cd d:\myproject\soloist
```

### Step 2: Install Dependencies
```bash
npm install
```
This will install:
- Angular framework and tools
- TypeScript compiler
- Build tools
- Form libraries
- All required dependencies (~500+ packages)

**Time**: ~2-5 minutes depending on your internet speed

### Step 3: Start Development Server
```bash
npm start
```
or
```bash
ng serve
```

You'll see output like:
```
✔ Compiled successfully.
Local: http://localhost:4200
```

### Step 4: Open in Browser
Navigate to: `http://localhost:4200`

You should see the Soloist login page with social provider buttons.

---

## 🧪 Testing the Application

### Test Scenario 1: Social Login

1. **Click Facebook Button**
   - Loading animation appears
   - Email pre-filled as "user.facebook@example.com"
   - Auto-redirects to registration page after 1.5 seconds

2. **Try Other Providers**
   - Click LinkedIn, Gmail, Yahoo, or Microsoft
   - Each shows a different email prefix

### Test Scenario 2: Complete Registration

1. **Fill Required Fields**
   - First Name: John
   - Last Name: Doe
   - Date of Birth: Select any date
   - Gender: Select option
   - Note: Email and User ID are grayed out (non-editable)

2. **Fill Optional Fields**
   - Phone: (123) 456-7890
   - Location: New York, USA
   - Headline: Software Developer
   - Bio: Write something about yourself
   - Website: https://example.com

3. **Accept Terms**
   - Check the "I agree to Terms and Conditions" checkbox
   - Click the link to read full terms in a modal
   - Click "I Agree to Terms" button in the modal
   - Checkbox becomes checked

4. **Submit Registration**
   - Click "Complete Registration" button
   - Wait for success message
   - Auto-redirect to profile page

### Test Scenario 3: View Profile

1. **Profile Page Displays**
   - Header with banner and avatar
   - User information in organized sections
   - Edit Profile button
   - Profile completion percentage

2. **Sections Visible**
   - Account Information (User ID, Email, Created Date)
   - Personal Information (Name, DOB, Gender, Phone)
   - Professional Information (Location, Headline, Website)
   - About section (Bio text)

### Test Scenario 4: Edit Profile

1. **Click "Edit Profile"**
   - Form switches to edit mode
   - All fields become editable (except Email & User ID)
   - "Save Changes" and "Cancel" buttons appear

2. **Make Changes**
   - Update any fieldexcept email and user ID
   - Bio character count updates in real-time
   - Form validates as you type

3. **Save Changes**
   - Click "Save Changes"
   - Success message appears
   - Profile updates with new data
   - Edit mode closes

### Test Scenario 5: Logout

1. **Click Avatar** (top-right corner)
   - Dropdown menu appears
   - Shows "My Profile" and "Logout" options

2. **Click Logout**
   - Returns to login page
   - All session data cleared
   - localStorage cleared
   - Can login again

---

## 📁 File Structure Verification

After setup, your project should have:

```
soloist/
├── .git/                    ✓ Git repository
├── node_modules/            ✓ Installed dependencies (500+ folders)
├── src/                     ✓ Source code
├── angular.json             ✓ Angular config
├── package.json             ✓ Dependencies list
├── tsconfig.json            ✓ TypeScript config
├── README.md                ✓ Documentation
├── QUICKSTART.md            ✓ Quick start guide
├── DEVELOPMENT.md           ✓ Dev guide
└── ...
```

---

## ⚙️ Development Server Commands

### Start Dev Server
```bash
npm start
# or
ng serve
```

### Build for Production
```bash
npm run build
# or
ng build --configuration production
# Output: dist/soloist/
```

### Run Tests
```bash
npm test
# or
ng test
```

### Lint Code
```bash
ng lint
```

---

## 🔧 Troubleshooting Installation Issues

### Issue 1: npm command not found
**Solution**: Install Node.js from https://nodejs.org/

```bash
node --version
npm --version
```

### Issue 2: Port 4200 already in use
**Solution**: Use a different port
```bash
ng serve --port 4300
# Then visit: http://localhost:4300
```

### Issue 3: Module not found errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Angular CLI not found
**Solution**: Install globally
```bash
npm install -g @angular/cli@17
```

### Issue 5: TypeScript errors
**Solution**: Check TypeScript version
```bash
npm list typescript
# Should show 5.2.x or compatible
```

---

## 📱 Testing on Different Devices

### Desktop Browser
```bash
ng serve
# Visit: http://localhost:4200
```

### Mobile Browser (Same Network)
```bash
ng serve --host 0.0.0.0
# Get your PC IP address (Windows: ipconfig)
# Visit: http://YOUR_IP:4200 on mobile
```

### Different Browsers
- Chrome (recommended for development)
- Firefox
- Safari
- Edge

---

## 🔐 Security Notes for Development

**Current Setup is for Demo/Development only:**

1. **Do NOT use this in production** without real OAuth
2. **localStorage is NOT SECURE** for sensitive data
3. **No backend validation** in current setup
4. **No encryption** implemented

**For Production**:
- Implement real OAuth with providers
- Add backend API for validation
- Use secure token storage (HTTPOnly cookies)
- Implement HTTPS only
- Add CSRF protection
- Implement proper access controls

---

## 🌐 Real OAuth Integration (Optional)

To use real social login:

### Facebook

1. Go to https://developers.facebook.com/
2. Create new app
3. Get App ID and App Secret
4. In `auth.service.ts`:

```typescript
const fbAppId = 'YOUR_FACEBOOK_APP_ID';
```

### LinkedIn

1. Go to https://www.linkedin.com/developers/
2. Create application
3. Get Client ID
4. Get Client Secret
5. Configure in service

### Google/Gmail

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Get Client ID
4. Configure scopes

### Microsoft

1. Go to https://portal.azure.com/
2. Register application
3. Get Application ID
4. Configure permissions

### Yahoo

1. Go to https://developer.yahoo.com/
2. Create app
3. Get Consumer Key
4. Get Consumer Secret

---

## 📚 Next Learning Steps

After setup, explore:

1. **Component Structure** - Look at `src/app/components/`
2. **Service Architecture** - Study `src/app/services/auth.service.ts`
3. **Form Validation** - Check `registration.component.ts`
4. **Routing** - Review `app-routing.module.ts`
5. **Styling** - Study SCSS files for design patterns

---

## 💾 Save Your Progress

After setup, commit to git:

```bash
git add .
git commit -m "Initial Angular setup with social login"
git status
```

---

## 🎯 Deployment Options

### Quick Hosting:

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/soloist
```

**Firebase**:
```bash
npm install -g firebase-tools
firebase deploy
```

---

## 📞 Getting Help

### Check Documentation
1. README.md - Complete guide
2. QUICKSTART.md - Fast setup
3. DEVELOPMENT.md - Architecture details
4. Browser Console - Error messages (F12)

### Common Issues

**Form not submitting?**
- Check browser console (F12) for errors
- Verify all required fields are filled
- Ensure Terms checkbox is checked

**Data not saving?**
- Enable localStorage in browser
- Check localStorage in DevTools (F12 → Application)
- Clear cache if needed (Ctrl+Shift+Delete)

**Page not loading?**
- Check Network tab in DevTools
- Verify server started: `npm start`
- Try different port: `ng serve --port 4300`

---

## ✅ Setup Checklist

- [ ] Node.js installed (v14+)
- [ ] npm installed (v6+)
- [ ] `npm install` completed
- [ ] `npm start` running
- [ ] Browser open at localhost:4200
- [ ] Login page visible
- [ ] Social buttons clickable
- [ ] All components loading
- [ ] No console errors

---

## 🎉 You're All Set!

Your Soloist Angular application is ready to use. 

**Next Steps**:
1. Explore the components
2. Test the user flows
3. Customize colors and content
4. Consider real OAuth integration
5. Deploy to production

**Questions?** Check:
- README.md
- DEVELOPMENT.md
- Browser Console (F12)
- Angular Docs: https://angular.io

---

**Happy coding!** 🚀

*Last Updated: March 6, 2026*
*Angular Version: 17.0.0*
*TypeScript: 5.2.0*
