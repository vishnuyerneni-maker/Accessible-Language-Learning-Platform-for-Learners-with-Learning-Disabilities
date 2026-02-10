# 🔧 Troubleshooting QR Code Issues

## Quick Diagnostic Steps

### Step 1: Open Test Page
```bash
start test-mfa.html
```

This will show you:
- ✓ Which functions are loaded
- ✓ If QRCode library is working
- ✓ Test QR code generation

### Step 2: Check Browser Console
1. Open your browser (Chrome/Edge recommended)
2. Press `F12` to open Developer Tools
3. Click "Console" tab
4. Look for any **red error messages**

---

## Common Issues & Solutions

### Issue 1: QR Code Not Appearing

**Symptoms:**
- Login works but no QR code shows
- Modal appears but QR area is empty
- Blank white square

**Solutions:**

**A. Check Internet Connection**
- QRCode.js loads from CDN
- Needs internet to download library
- Test: Open test-mfa.html and click "Generate Test QR Code"

**B. Clear Browser Cache**
```
Press: Ctrl + Shift + Delete
Select: Cached images and files
Click: Clear data
Refresh page: Ctrl + F5
```

**C. Check Console for Errors**
Common errors:
- `QRCode is not defined` → Library not loaded
- `Cannot read property 'appendChild'` → Element not found
- `Failed to load resource` → Network issue

---

### Issue 2: Functions Not Working

**Check if files are loaded:**
1. Open index.html
2. Press F12
3. Type in console:
```javascript
typeof MFAAuth
// Should return: "object"

typeof QRCode
// Should return: "function"

MFAAuth.generateSecret()
// Should return: a 32-character string
```

**If returns "undefined":**
- mfa-auth.js not loaded
- Check file path in HTML
- Ensure file exists

---

### Issue 3: Modal Not Appearing

**Check:**
1. Login credentials correct?
2. Does `MockBackend.getCurrentUser()` work?
3. Is modal HTML being added to page?

**Debug:**
```javascript
// In console after login
const user = MockBackend.getCurrentUser();
console.log(user);
// Should show user object with mfaEnabled: false
```

---

##Fix Attempts

### Fix 1: Reload All Scripts
Add to index.html before `</body>`:
```html
<script src="script.js"></script>
<script src="gamification.js"></script>
<script src="mfa-auth.js"></script>
```

### Fix 2: Force QRCode Library Load
Replace QRCode script tag with:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" 
        integrity="sha512-CNgIRecGo7nphbeZ04Sc13ka07paqdeTu0WR1IM4kNcpmBAUSHSQX0FslNhTDadL4O5SAGapGt4FodqL8My0mA==" 
        crossorigin="anonymous" 
        referrerpolicy="no-referrer">
</script>
```

### Fix 3: Check User Registration
```javascript
// In console
const users = JSON.parse(localStorage.getItem('app_users_db'));
console.log(users);
// Should show array of user objects
```

---

## Testing Steps

### Test 1: Registration
1. Open app
2. Click "Sign up"
3. Fill form: username, name, email, password (strong), confirm
4. Submit
5. Should see success message
6. Redirected to login

### Test 2: First Login
1. Enter username and password
2. Click "Sign In"
3. **QR code modal should appear here**
4. If not, check console for errors

### Test 3: Manual Test
Open browser console and run:
```javascript
// Test secret generation
const secret = MFAAuth.generateSecret();
console.log('Secret:', secret);

// Test QR data generation
const qrData = MFAAuth.generateQRData('testuser', secret);
console.log('QR Data:', qrData);

// Test QR code creation
const container = document.createElement('div');
document.body.appendChild(container);
new QRCode(container, {
    text: qrData,
    width: 200,
    height: 200
});
console.log('QR code should appear on page');
```

---

## What Should Happen

### Correct Flow:
```
1. Register account
   ↓
2. Login with credentials
   ↓
3. index.html login form handler runs
   ↓
4. MockBackend.login() validates
   ↓
5. MockBackend.getCurrentUser() returns user
   ↓
6. Check: user.mfaEnabled === false
   ↓
7. Call: showMFASetup(user)
   ↓
8. Generate secret: MFAAuth.generateSecret()
   ↓
9. Generate QR data: MFAAuth.generateQRData(username, secret)
   ↓
10. Create modal with QR container
    ↓
11. Generate QR: new QRCode(container, {...})
    ↓
12. QR code visible ✓
```

---

## Browser Compatibility

### Recommended:
- ✅ Chrome (best)
- ✅ Edge (best)
- ⚠️ Firefox (good, might need refresh)
- ⚠️ Safari (works but slower)

### Not Supported:
- ❌ Internet Explorer

---

## Quick Fixes

### Try These in Order:

**1. Hard Refresh**
```
Ctrl + Shift + R
or
Ctrl + F5
```

**2. Clear Cache & Cookies**
```
F12 → Application → Clear storage → Clear site data
```

**3. Test in Incognito/Private Window**
```
Ctrl + Shift + N (Chrome/Edge)
Ctrl + Shift + P (Firefox)
```

**4. Check Network Tab**
```
F12 → Network → Reload page
Look for failed requests (red)
```

**5. Reinstall Dependencies**
Delete these and retry:
- Clear localStorage
- Clear sessionStorage
- Refresh page

---

## Emergency Workaround

If nothing works, here's a manual test:

**Create manual-mfa-test.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
</head>
<body>
    <h1>QR Test</h1>
    <div id="qr"></div>
    <script>
        new QRCode(document.getElementById('qr'), {
            text: 'otpauth://totp/AccessLearn:test?secret=TEST123&issuer=AccessLearn',
            width: 200,
            height: 200
        });
    </script>
</body>
</html>
```

If this works → QRCode.js is fine, issue is in integration
If this fails → QRCode.js library problem

---

## Get Help

### Information to Collect:
1. Browser name and version
2. Console errors (screenshot)
3. Result from test-mfa.html
4. Network tab errors
5. localStorage data

### Check These Files Exist:
- [ ] index.html
- [ ] register.html
- [ ] script.js
- [ ] mfa-auth.js
- [ ] gamification.js
- [ ] style.css

---

## Expected Console Output

### When Working Correctly:
```
[No errors]
MFAAuth: object
QRCode: function
User object: {...}
Modal created successfully
QR code rendered
```

### When Broken:
```
Error: QRCode is not defined
Error: MFAAuth is not defined
Error: Cannot read property...
Failed to load resource: qrcode.min.js
```

---

## Final Steps

If all else fails:

1. **Backup your data**
   ```javascript
   const users = localStorage.getItem('app_users_db');
   console.log(users); // Copy this
   ```

2. **Clear everything**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

3. **Refresh page** (Ctrl + F5)

4. **Try registration again**

---

**Need More Help?**
- Run: `start test-mfa.html`
- Check console errors
- Try different browser
- Clear cache and retry

---

*Troubleshooting Guide v1.0*
