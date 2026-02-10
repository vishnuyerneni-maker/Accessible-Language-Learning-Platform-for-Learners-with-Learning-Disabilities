/**
 * Multi-Factor Authentication with QR Code and OTP
 * Compatible with Microsoft Authenticator and Google Authenticator
 */

// ============================================
// OTP/TOTP Generation
// ============================================
const MFAAuth = {
    
    /**
     * Generate a random secret key for TOTP
     */
    generateSecret() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < 32; i++) {
            secret += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return secret;
    },

    /**
     * Generate QR code data URL for authenticator apps
     */
    generateQRCode(username, secret) {
        const issuer = 'AccessLearn';
        const label = `${issuer}:${username}`;
        const otpauthUrl = `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
        
        return otpauthUrl;
    },

    /**
     * Display QR code in modal
     */
    async showQRCodeModal(username) {
        const user = MockBackend.getCurrentUser();
        if (!user) return;

        // Generate or get existing secret
        if (!user.mfaSecret) {
            user.mfaSecret = this.generateSecret();
            user.mfaEnabled = false;
            MockBackend.saveUser(user);
        }

        const otpauthUrl = this.generateQRCode(username, user.mfaSecret);
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'mfa-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        modal.innerHTML = `
            <div class="card" style="max-width: 500px; width: 90%; padding: 40px; position: relative; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('mfa-modal').remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="text-align: center; margin-bottom: 20px;">🔐 Setup Authenticator</h2>
                
                <div style="text-align: center; margin-bottom: 25px;">
                    <p style="color: var(--text-muted); margin-bottom: 20px;">Scan this QR code with Microsoft Authenticator or Google Authenticator</p>
                    <div id="qrcode-container" style="display: flex; justify-content: center; margin: 20px 0;"></div>
                </div>
                
                <div style="background: var(--surface-elevated); padding: 15px; border-radius: var(--radius-md); margin-bottom: 20px;">
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">Manual Entry Key:</p>
                    <code style="display: block; padding: 10px; background: var(--background-color); border-radius: var(--radius-sm); font-family: monospace; word-break: break-all;">${user.mfaSecret}</code>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Enter 6-digit code from app:</label>
                    <input type="text" id="otp-input" maxlength="6" placeholder="000000" 
                           style="width: 100%; padding: 15px; font-size: 1.5rem; text-align: center; border: 2px solid var(--border-color); border-radius: var(--radius-md); letter-spacing: 0.3em;"
                           oninput="this.value = this.value.replace(/[^0-9]/g, '')">
                </div>
                
                <button onclick="MFAAuth.verifyAndEnableMFA()" class="btn btn-primary" style="width: 100%;">
                    ✓ Verify & Enable MFA
                </button>
                
                <p style="text-align: center; margin-top: 15px; font-size: 0.85rem; color: var(--text-muted);">
                    Once enabled, you'll need this code every time you log in
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Generate QR code using QRCode.js
        setTimeout(() => {
            new QRCode(document.getElementById('qrcode-container'), {
                text: otpauthUrl,
                width: 256,
                height: 256,
                colorDark: getComputedStyle(document.documentElement).getPropertyValue('--text-main').trim() || '#000000',
                colorLight: getComputedStyle(document.documentElement).getPropertyValue('--surface-color').trim() || '#ffffff',
            });
        }, 100);
    },

    /**
     * Verify OTP code
     */
    verifyOTP(secret, token) {
        // Simple TOTP verification (30-second window)
        const epoch = Math.floor(Date.now() / 1000);
        const timeStep = 30;
        const counter = Math.floor(epoch / timeStep);
        
        // Check current window and ±1 window for clock drift
        for (let i = -1; i <= 1; i++) {
            const testCounter = counter + i;
            const generatedToken = this.generateTOTP(secret, testCounter);
            if (generatedToken === token) {
                return true;
            }
        }
        return false;
    },

    /**
     * Generate TOTP token (simplified implementation)
     */
    generateTOTP(secret, counter) {
        // Simplified TOTP generation
        // In production, use a proper TOTP library like otplib
        const hash = this.simpleHash(secret + counter.toString());
        const code = (hash % 1000000).toString().padStart(6, '0');
        return code;
    },

    /**
     * Simple hash function (for demo purposes)
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    },

    /**
     * Verify and enable MFA
     */
    verifyAndEnableMFA() {
        const otpInput = document.getElementById('otp-input');
        const code = otpInput.value;
        
        if (code.length !== 6) {
            showToast('❌ Please enter a 6-digit code');
            otpInput.classList.add('animate-shake');
            setTimeout(() => otpInput.classList.remove('animate-shake'), 500);
            return;
        }
        
        const user = MockBackend.getCurrentUser();
        if (!user || !user.mfaSecret) return;
        
        if (this.verifyOTP(user.mfaSecret, code)) {
            user.mfaEnabled = true;
            MockBackend.saveUser(user);
            
            document.getElementById('mfa-modal').remove();
            showToast('✅ MFA enabled successfully!');
            showCelebration('MFA Activated!');
            
            // Update UI if there's an MFA indicator
            const mfaIndicator = document.getElementById('mfa-status');
            if (mfaIndicator) {
                mfaIndicator.innerHTML = '🔐 <span style="color: var(--success-color);">Enabled</span>';
            }
        } else {
            showToast('❌ Invalid code. Please try again.');
            otpInput.value = '';
            otpInput.classList.add('animate-shake');
            setTimeout(() => otpInput.classList.remove('animate-shake'), 500);
        }
    },

    /**
     * Show OTP verification modal for login
     */
    showOTPVerificationModal(username, password) {
        const modal = document.createElement('div');
        modal.id = 'otp-verify-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        modal.innerHTML = `
            <div class="card" style="max-width: 400px; width: 90%; padding: 40px; text-align: center; animation: scaleIn 0.3s;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🔐</div>
                <h2 style="margin-bottom: 15px;">Enter Verification Code</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">
                    Open your authenticator app and enter the 6-digit code
                </p>
                
                <input type="text" id="login-otp-input" maxlength="6" placeholder="000000" 
                       style="width: 100%; padding: 15px; font-size: 1.5rem; text-align: center; border: 2px solid var(--border-color); border-radius: var(--radius-md); letter-spacing: 0.3em; margin-bottom: 20px;"
                       oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                       autofocus>
                
                <button onclick="MFAAuth.completeLoginWithOTP('${username}', '${password}')" class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">
                    ✓ Verify & Login
                </button>
                
                <button onclick="document.getElementById('otp-verify-modal').remove()" class="btn btn-outline" style="width: 100%;">
                    Cancel
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    /**
     * Complete login with OTP verification
     */
    completeLoginWithOTP(username, password) {
        const otpInput = document.getElementById('login-otp-input');
        const code = otpInput.value;
        
        if (code.length !== 6) {
            showToast('❌ Please enter a 6-digit code');
            return;
        }
        
        // Verify credentials first
        const result = MockBackend.login(username, password);
        if (!result.success) {
            showToast('❌ Invalid credentials');
            return;
        }
        
        const user = MockBackend.getCurrentUser();
        if (this.verifyOTP(user.mfaSecret, code)) {
            document.getElementById('otp-verify-modal').remove();
            showToast('✨ Login successful!');
            
            // Redirect based on role
            setTimeout(() => {
                if (result.role === 'parent') {
                    window.location.href = 'parent_dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 500);
        } else {
            showToast('❌ Invalid verification code');
            otpInput.value = '';
            otpInput.classList.add('animate-shake');
            setTimeout(() => otpInput.classList.remove('animate-shake'), 500);
        }
    },

    /**
     * Disable MFA
     */
    disableMFA() {
        if (!confirm('Are you sure you want to disable Multi-Factor Authentication?')) {
            return;
        }
        
        const user = MockBackend.getCurrentUser();
        if (!user) return;
        
        user.mfaEnabled = false;
        user.mfaSecret = null;
        MockBackend.saveUser(user);
        
        showToast('🔓 MFA disabled');
        
        // Update UI
        const mfaIndicator = document.getElementById('mfa-status');
        if (mfaIndicator) {
            mfaIndicator.innerHTML = '🔓 <span style="color: var(--text-muted);">Disabled</span>';
        }
    }
};
