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
     * Alias for compatibility
     */
    generateQRData(username, secret) {
        return this.generateQRCode(username, secret);
    },
    
    /**
     * Enable MFA for a user
     */
    enableMFA(username, secret) {
        const users = JSON.parse(localStorage.getItem('app_users_db')) || [];
        const user = users.find(u => u.username === username);
        if (user) {
            user.mfaSecret = secret;
            user.mfaEnabled = true;
            localStorage.setItem('app_users_db', JSON.stringify(users));
            localStorage.setItem('app_current_session', JSON.stringify(user));
        }
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
        // TOTP verification with proper HMAC-SHA1 (30-second window)
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
     * Generate TOTP token (RFC 6238 compatible)
     */
    generateTOTP(secret, counter) {
        try {
            // Decode base32 secret
            const key = this.base32Decode(secret);
            
            // Convert counter to 8-byte array
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setUint32(4, counter, false);
            
            // Generate HMAC-SHA1
            const hmac = this.hmacSha1(key, new Uint8Array(buffer));
            
            // Dynamic truncation
            const offset = hmac[hmac.length - 1] & 0x0f;
            const binary = ((hmac[offset] & 0x7f) << 24) |
                          ((hmac[offset + 1] & 0xff) << 16) |
                          ((hmac[offset + 2] & 0xff) << 8) |
                          (hmac[offset + 3] & 0xff);
            
            const otp = binary % 1000000;
            return otp.toString().padStart(6, '0');
        } catch (e) {
            console.error('TOTP generation error:', e);
            return '000000';
        }
    },

    /**
     * Base32 decode
     */
    base32Decode(base32) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        let value = 0;
        
        base32 = base32.toUpperCase().replace(/=+$/, '');
        
        for (let i = 0; i < base32.length; i++) {
            const val = alphabet.indexOf(base32.charAt(i));
            if (val === -1) continue;
            bits += val.toString(2).padStart(5, '0');
        }
        
        const bytes = [];
        for (let i = 0; i + 8 <= bits.length; i += 8) {
            bytes.push(parseInt(bits.substr(i, 8), 2));
        }
        
        return new Uint8Array(bytes);
    },

    /**
     * HMAC-SHA1 implementation
     */
    hmacSha1(key, message) {
        const blockSize = 64;
        
        // Ensure key is the right length
        if (key.length > blockSize) {
            key = this.sha1(key);
        }
        if (key.length < blockSize) {
            const newKey = new Uint8Array(blockSize);
            newKey.set(key);
            key = newKey;
        }
        
        // Create inner and outer padding
        const oKeyPad = new Uint8Array(blockSize);
        const iKeyPad = new Uint8Array(blockSize);
        
        for (let i = 0; i < blockSize; i++) {
            oKeyPad[i] = 0x5c ^ key[i];
            iKeyPad[i] = 0x36 ^ key[i];
        }
        
        // Concatenate and hash
        const innerData = new Uint8Array(iKeyPad.length + message.length);
        innerData.set(iKeyPad);
        innerData.set(message, iKeyPad.length);
        const innerHash = this.sha1(innerData);
        
        const outerData = new Uint8Array(oKeyPad.length + innerHash.length);
        outerData.set(oKeyPad);
        outerData.set(innerHash, oKeyPad.length);
        
        return this.sha1(outerData);
    },

    /**
     * SHA1 implementation
     */
    sha1(data) {
        // Convert to array if needed
        if (!(data instanceof Uint8Array)) {
            data = new Uint8Array(data);
        }
        
        // Prepare message
        const msgLen = data.length;
        const bitLen = msgLen * 8;
        
        // Padding
        const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
        const padded = new Uint8Array(paddedLen);
        padded.set(data);
        padded[msgLen] = 0x80;
        
        // Add length
        const view = new DataView(padded.buffer);
        view.setUint32(paddedLen - 4, bitLen & 0xffffffff, false);
        
        // Initialize hash values
        let h0 = 0x67452301;
        let h1 = 0xEFCDAB89;
        let h2 = 0x98BADCFE;
        let h3 = 0x10325476;
        let h4 = 0xC3D2E1F0;
        
        // Process chunks
        for (let chunk = 0; chunk < paddedLen; chunk += 64) {
            const w = new Uint32Array(80);
            
            // Break chunk into sixteen 32-bit big-endian words
            for (let i = 0; i < 16; i++) {
                w[i] = view.getUint32(chunk + i * 4, false);
            }
            
            // Extend into 80 words
            for (let i = 16; i < 80; i++) {
                w[i] = this.rotateLeft(w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
            }
            
            // Initialize working variables
            let a = h0, b = h1, c = h2, d = h3, e = h4;
            
            // Main loop
            for (let i = 0; i < 80; i++) {
                let f, k;
                if (i < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 0x5A827999;
                } else if (i < 40) {
                    f = b ^ c ^ d;
                    k = 0x6ED9EBA1;
                } else if (i < 60) {
                    f = (b & c) | (b & d) | (c & d);
                    k = 0x8F1BBCDC;
                } else {
                    f = b ^ c ^ d;
                    k = 0xCA62C1D6;
                }
                
                const temp = (this.rotateLeft(a, 5) + f + e + k + w[i]) & 0xffffffff;
                e = d;
                d = c;
                c = this.rotateLeft(b, 30);
                b = a;
                a = temp;
            }
            
            // Add chunk hash to result
            h0 = (h0 + a) & 0xffffffff;
            h1 = (h1 + b) & 0xffffffff;
            h2 = (h2 + c) & 0xffffffff;
            h3 = (h3 + d) & 0xffffffff;
            h4 = (h4 + e) & 0xffffffff;
        }
        
        // Produce final hash
        const hash = new Uint8Array(20);
        const hashView = new DataView(hash.buffer);
        hashView.setUint32(0, h0, false);
        hashView.setUint32(4, h1, false);
        hashView.setUint32(8, h2, false);
        hashView.setUint32(12, h3, false);
        hashView.setUint32(16, h4, false);
        
        return hash;
    },

    /**
     * Rotate left
     */
    rotateLeft(n, shift) {
        return ((n << shift) | (n >>> (32 - shift))) & 0xffffffff;
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
