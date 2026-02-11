// FONT SIZE RESET SCRIPT
// Run this in your browser console (F12) to reset font size to normal

// Clear the font size setting
localStorage.removeItem('fontSize');

// Reset to 100%
localStorage.setItem('fontSize', '100');

// Reload the page
location.reload();

console.log('✅ Font size reset to 100% (normal)');
