import React, { createContext, useState, useEffect, useContext } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    const [theme, setTheme] = useState('light');
    const [fontSize, setFontSize] = useState(16);
    const [dyslexicFont, setDyslexicFont] = useState(false);
    const [screenReaderActive, setScreenReaderActive] = useState(false);

    // Initialize from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('siteTheme') || 'light';
        const savedFontSizeRaw = localStorage.getItem('fontSize');
        const savedFontSizeVal = parseInt(savedFontSizeRaw, 10);
        const savedFontSize = isNaN(savedFontSizeVal) ? 16 : savedFontSizeVal;

        const savedDyslexic = localStorage.getItem('dyslexiaFont') === 'true';
        const savedScreenReader = localStorage.getItem('screenReaderActive') === 'true';

        setTheme(savedTheme);
        setFontSize(savedFontSize);
        setDyslexicFont(savedDyslexic);
        setScreenReaderActive(savedScreenReader);
    }, []);

    // Apply side effects
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('siteTheme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--base-font-size', `${fontSize}px`);
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    useEffect(() => {
        if (dyslexicFont) {
            document.body.classList.add('dyslexia-font');
        } else {
            document.body.classList.remove('dyslexia-font');
        }
        localStorage.setItem('dyslexiaFont', dyslexicFont);
    }, [dyslexicFont]);

    useEffect(() => {
        localStorage.setItem('screenReaderActive', screenReaderActive);
    }, [screenReaderActive]);

    const toggleTheme = () => {
        setTheme(prev => {
            if (prev === 'light') return 'dark';
            if (prev === 'dark') return 'high-contrast';
            return 'light';
        });
    };

    const toggleDyslexicFont = () => setDyslexicFont(prev => !prev);
    const toggleScreenReader = () => setScreenReaderActive(prev => !prev);

    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 32));
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12));

    return (
        <AccessibilityContext.Provider value={{
            theme,
            fontSize,
            dyslexicFont,
            screenReaderActive,
            toggleTheme,
            toggleDyslexicFont,
            toggleScreenReader,
            increaseFontSize,
            decreaseFontSize
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
};
