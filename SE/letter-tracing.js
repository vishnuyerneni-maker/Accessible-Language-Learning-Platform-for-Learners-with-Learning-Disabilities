/**
 * Letter Tracing & Drawing Module
 * - Canvas-based letter tracing
 * - Draw mode
 * - Speak-while-write
 * - Multisensory feedback
 */

const LetterTracing = {
    
    canvas: null,
    ctx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    
    /**
     * Initialize canvas for tracing
     */
    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return false;
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        // Drawing settings
        this.ctx.lineWidth = 15;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Event listeners
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e));
        this.canvas.addEventListener('touchmove', (e) => this.draw(e));
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        
        return true;
    },
    
    /**
     * Start drawing
     */
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoords(e);
        [this.lastX, this.lastY] = [coords.x, coords.y];
    },
    
    /**
     * Draw on canvas
     */
    draw(e) {
        if (!this.isDrawing) return;
        
        e.preventDefault();
        const coords = this.getCoords(e);
        
        // Get gradient color
        const gradient = this.ctx.createLinearGradient(this.lastX, this.lastY, coords.x, coords.y);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        this.ctx.strokeStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        
        [this.lastX, this.lastY] = [coords.x, coords.y];
    },
    
    /**
     * Stop drawing
     */
    stopDrawing() {
        this.isDrawing = false;
    },
    
    /**
     * Get mouse/touch coordinates
     */
    getCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    },
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    
    /**
     * Draw letter template
     */
    drawTemplate(letter) {
        this.clear();
        
        this.ctx.font = 'bold 300px Arial';
        this.ctx.fillStyle = 'rgba(124, 58, 237, 0.1)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(letter.toUpperCase(), this.canvas.width / 2, this.canvas.height / 2);
    },
    
    /**
     * Show tracing interface
     */
    showTracingInterface(letter) {
        const modal = document.createElement('div');
        modal.id = 'tracing-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s; padding: 20px;';
        
        modal.innerHTML = `
            <div style="width: 100%; max-width: 900px; text-align: center;">
                <button onclick="document.getElementById('tracing-modal').remove()" 
                        style="position: absolute; top: 20px; right: 20px; background: var(--surface-color); border: none; font-size: 1.5rem; cursor: pointer; padding: 10px 20px; border-radius: var(--radius-md); color: var(--text-main);">
                    ✕ Close
                </button>
                
                <h2 style="color: white; margin-bottom: 20px; font-size: 2rem;">
                    ✍️ Trace Letter ${letter.toUpperCase()}
                </h2>
                <p style="color: rgba(255,255,255,0.7); margin-bottom: 30px; font-size: 1.2rem;">
                    Trace the letter with your mouse or finger
                </p>
                
                <canvas id="tracing-canvas" 
                        style="
                            background: white; 
                            border-radius: var(--radius-xl); 
                            box-shadow: var(--shadow-xl); 
                            cursor: crosshair;
                            touch-action: none;
                            max-width: 800px;
                            width: 100%;
                            height: 500px;
                        "></canvas>
                
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px; flex-wrap: wrap;">
                    <button onclick="LetterTracing.clear()" class="btn btn-outline" style="background: white; color: var(--text-main);">
                        🗑️ Clear
                    </button>
                    <button onclick="LetterTracing.drawTemplate('${letter}')" class="btn btn-primary">
                        📝 Show Template
                    </button>
                    <button onclick="PhonicsModule.pronounceLetter('${letter}')" class="btn btn-secondary">
                        🔊 Hear Sound
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Initialize canvas after modal is added
        setTimeout(() => {
            if (this.initCanvas('tracing-canvas')) {
                this.drawTemplate(letter);
            }
        }, 100);
    }
};

/**
 * Drag & Drop Word Builder
 */
const WordBuilder = {
    
    /**
     * Show word building interface
     */
    showWordBuilder(targetWord) {
        const letters = targetWord.toUpperCase().split('');
        const shuffled = [...letters].sort(() => Math.random() - 0.5);
        
        const modal = document.createElement('div');
        modal.id = 'word-builder-modal';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 9999; animation: fadeIn 0.3s;';
        
        const letterBlocks = shuffled.map((letter, index) => `
            <div class="letter-block" draggable="true" data-letter="${letter}" data-index="${index}"
                 style="
                    font-size: 3rem;
                    font-weight: bold;
                    padding: 25px 30px;
                    background: var(--primary-gradient);
                    color: white;
                    border-radius: var(--radius-lg);
                    margin: 10px;
                    cursor: grab;
                    box-shadow: var(--shadow-lg);
                    transition: all 0.2s;
                    user-select: none;
                 ">
                ${letter}
            </div>
        `).join('');
        
        const dropZones = letters.map((_, index) => `
            <div class="drop-zone" data-position="${index}"
                 style="
                    min-width: 80px;
                    height: 100px;
                    border: 3px dashed var(--primary-color);
                    border-radius: var(--radius-lg);
                    margin: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 3rem;
                    background: var(--surface-elevated);
                    transition: all 0.3s;
                 ">
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="card" style="max-width: 900px; width: 90%; padding: 50px; text-align: center; animation: scaleIn 0.3s;">
                <button onclick="document.getElementById('word-builder-modal').remove()" 
                        style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 2rem; cursor: pointer; color: var(--text-muted);">&times;</button>
                
                <h2 style="margin-bottom: 20px;">🎮 Build the Word!</h2>
                <p style="color: var(--text-muted); margin-bottom: 40px; font-size: 1.2rem;">
                    Drag letters to spell: <strong style="color: var(--primary-color);">${targetWord.toUpperCase()}</strong>
                </p>
                
                <div style="display: flex; justify-content: center; margin-bottom: 50px; flex-wrap: wrap;">
                    ${dropZones}
                </div>
                
                <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 20px; background: var(--surface-elevated); border-radius: var(--radius-xl);">
                    ${letterBlocks}
                </div>
                
                <button onclick="checkWord('${targetWord}')" class="btn btn-primary btn-lg" style="margin-top: 30px;">
                    ✓ Check Answer
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup drag and drop
        setTimeout(() => this.setupDragDrop(targetWord), 100);
    },
    
    /**
     * Setup drag and drop functionality
     */
    setupDragDrop(targetWord) {
        const blocks = document.querySelectorAll('.letter-block');
        const zones = document.querySelectorAll('.drop-zone');
        
        blocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.letter);
                e.target.style.opacity = '0.5';
            });
            
            block.addEventListener('dragend', (e) => {
                e.target.style.opacity = '1';
            });
        });
        
        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.style.background = 'var(--primary-color)';
                zone.style.borderStyle = 'solid';
            });
            
            zone.addEventListener('dragleave', () => {
                zone.style.background = 'var(--surface-elevated)';
                zone.style.borderStyle = 'dashed';
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const letter = e.dataTransfer.getData('text/plain');
                zone.textContent = letter;
                zone.style.background = 'var(--success-color)';
                zone.style.color = 'white';
                zone.style.borderStyle = 'solid';
                
                // Speak letter
                if (typeof PhonicsModule !== 'undefined') {
                    PhonicsModule.speak(letter, 1.0);
                }
            });
        });
        
        // Check word function
        window.checkWord = () => {
            const zones = document.querySelectorAll('.drop-zone');
            const builtWord = Array.from(zones).map(z => z.textContent).join('');
            
            if (builtWord.toUpperCase() === targetWord.toUpperCase()) {
                showCelebration('Perfect!');
                showToast('🎉 Correct! Well done!');
                if (typeof PhonicsModule !== 'undefined') {
                    PhonicsModule.speak(`Excellent! ${targetWord}`, 1.0);
                }
            } else {
                showToast('❌ Try again!');
                zones.forEach(z => {
                    if (z.textContent) {
                        z.style.background = 'var(--error-color)';
                        setTimeout(() => {
                            z.textContent = '';
                            z.style.background = 'var(--surface-elevated)';
                        }, 1000);
                    }
                });
            }
        };
    }
};
