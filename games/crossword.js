class Crossword {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 35;
        this.padding = 20;
        this.selectedCell = null;
        this.direction = 'across';
        
        // Enhanced theme colors
        this.colors = {
            background: '#000080',
            grid: '#FFFFFF',
            highlight: 'rgba(0, 177, 64, 0.3)',
            activeHighlight: 'rgba(0, 177, 64, 0.5)',
            text: '#FFD700',
            clue: '#FFFFFF',
            number: '#000080'
        };

        // Enhanced crossword puzzle with journalism terms
        this.puzzle = {
            grid: [
                ['J', 'U', 'R', 'N', 'A', 'L', 'I', 'S', 0, 0],
                ['F', 0, 0, 'A', 0, 'I', 0, 'U', 0, 0],
                ['B', 'E', 'R', 'I', 'T', 'A', 0, 'M', 0, 0],
                ['A', 0, 0, 'A', 0, 'P', 0, 'B', 0, 0],
                ['M', 'E', 'D', 'I', 'A', 'O', 'R', 'E', 'R', 0],
                ['T', 0, 0, 'F', 0, 'R', 0, 'R', 0, 0],
                ['A', 0, 'F', 'A', 'K', 'T', 'A', 0, 0, 0],
                [0, 0, 0, 'K', 0, 'E', 0, 0, 0, 0],
                [0, 0, 'W', 'A', 'R', 'R', 0, 0, 0, 0],
                [0, 0, 0, 'T', 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 'A', 0, 0, 0, 0, 0, 0]
            ],
            numbers: {
                '1': [0, 0],   // JURNALIS
                '2': [2, 0],   // BERITA
                '3': [4, 0],   // MEDIA
                '4': [6, 2],   // FAKTA
                '5': [8, 2],   // WAR
                '6': [0, 3],   // NARATIF
                '7': [0, 5],   // LIAPORAN
                '8': [0, 7],   // SUMBER
                '9': [0, 1]    // FAKTA
            },
            words: {
                across: {
                    1: { clue: 'Profesi menulis dan melaporkan berita', answer: 'JURNALIS' },
                    2: { clue: 'Informasi atau kabar tentang kejadian', answer: 'BERITA' },
                    3: { clue: 'Sarana komunikasi massa', answer: 'MEDIA' },
                    4: { clue: 'Kenyataan; hal yang benar-benar terjadi', answer: 'FAKTA' },
                    5: { clue: 'Perang (Eng)', answer: 'WAR' }
                },
                down: {
                    6: { clue: 'Gaya penulisan yang menceritakan kejadian', answer: 'NARATIF' },
                    7: { clue: 'Hasil peliputan berita', answer: 'LIAPORAN' },
                    8: { clue: 'Asal informasi berita', answer: 'SUMBER' },
                    9: { clue: 'Kenyataan yang terjadi', answer: 'FAKTA' }
                }
            },
            userInput: Array(11).fill().map(() => Array(10).fill(''))
        };

        // Add event listeners
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const gridX = Math.floor((x - this.padding) / this.cellSize);
        const gridY = Math.floor((y - this.padding) / this.cellSize);
        
        if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 11) {
            if (this.puzzle.grid[gridY][gridX] !== 0) {
                if (this.selectedCell && this.selectedCell.x === gridX && this.selectedCell.y === gridY) {
                    this.direction = this.direction === 'across' ? 'down' : 'across';
                } else {
                    this.selectedCell = { x: gridX, y: gridY };
                }
                this.draw();
            }
        }
    }

    handleKeyPress(event) {
        if (!this.selectedCell) return;

        if (event.key.match(/^[a-zA-Z]$/)) {
            const letter = event.key.toUpperCase();
            this.puzzle.userInput[this.selectedCell.y][this.selectedCell.x] = letter;
            
            // Move to next cell
            if (this.direction === 'across') {
                if (this.selectedCell.x < 9 && this.puzzle.grid[this.selectedCell.y][this.selectedCell.x + 1] !== 0) {
                    this.selectedCell.x++;
                }
            } else {
                if (this.selectedCell.y < 10 && this.puzzle.grid[this.selectedCell.y + 1][this.selectedCell.x] !== 0) {
                    this.selectedCell.y++;
                }
            }
            
            this.draw();
            this.checkWin();
        } else if (event.key === 'Backspace') {
            this.puzzle.userInput[this.selectedCell.y][this.selectedCell.x] = '';
            // Move to previous cell
            if (this.direction === 'across' && this.selectedCell.x > 0) {
                this.selectedCell.x--;
            } else if (this.direction === 'down' && this.selectedCell.y > 0) {
                this.selectedCell.y--;
            }
            this.draw();
        } else if (event.key === 'Tab') {
            event.preventDefault();
            this.direction = this.direction === 'across' ? 'down' : 'across';
            this.draw();
        }
    }

    checkWin() {
        let isComplete = true;
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 10; x++) {
                if (typeof this.puzzle.grid[y][x] === 'string' && 
                    this.puzzle.userInput[y][x] !== this.puzzle.grid[y][x]) {
                    isComplete = false;
                    break;
                }
            }
        }
        
        if (isComplete) {
            this.showCongratulations();
        }
    }

    showCongratulations() {
        // Draw semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw congratulations text
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 32px Space Grotesk';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Selamat!', this.canvas.width/2, this.canvas.height/2 - 20);
        
        this.ctx.font = '20px Space Grotesk';
        this.ctx.fillText('Anda telah menyelesaikan teka-teki silang!', this.canvas.width/2, this.canvas.height/2 + 20);
        this.ctx.fillText('Klik "Mulai Baru" untuk bermain lagi', this.canvas.width/2, this.canvas.height/2 + 60);
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 10; x++) {
                const cellX = x * this.cellSize + this.padding;
                const cellY = y * this.cellSize + this.padding;

                if (this.puzzle.grid[y][x] !== 0) {
                    // Draw cell background
                    this.ctx.fillStyle = this.colors.grid;
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    
                    // Draw cell border
                    this.ctx.strokeStyle = this.colors.background;
                    this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);

                    // Highlight selected word
                    if (this.selectedCell) {
                        if (this.direction === 'across' && y === this.selectedCell.y) {
                            this.ctx.fillStyle = this.colors.highlight;
                            this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                        } else if (this.direction === 'down' && x === this.selectedCell.x) {
                            this.ctx.fillStyle = this.colors.highlight;
                            this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                        }
                    }

                    // Highlight selected cell
                    if (this.selectedCell && this.selectedCell.x === x && this.selectedCell.y === y) {
                        this.ctx.fillStyle = this.colors.activeHighlight;
                        this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    }

                    // Draw numbers
                    for (const [num, pos] of Object.entries(this.puzzle.numbers)) {
                        if (pos[0] === y && pos[1] === x) {
                            this.ctx.fillStyle = this.colors.number;
                            this.ctx.font = '12px Space Grotesk';
                            this.ctx.textAlign = 'left';
                            this.ctx.fillText(num, cellX + 2, cellY + 12);
                        }
                    }

                    // Draw user input
                    if (this.puzzle.userInput[y][x]) {
                        this.ctx.fillStyle = this.colors.text;
                        this.ctx.font = 'bold 24px Space Grotesk';
                        this.ctx.textAlign = 'center';
                        this.ctx.fillText(
                            this.puzzle.userInput[y][x],
                            cellX + this.cellSize/2,
                            cellY + this.cellSize/2 + 8
                        );
                    }
                }
            }
        }

        // Draw clues
        this.ctx.fillStyle = this.colors.clue;
        this.ctx.font = '16px Space Grotesk';
        this.ctx.textAlign = 'left';
        
        let clueY = 20;
        this.ctx.fillText('Mendatar:', 420, clueY);
        clueY += 30;
        
        for (const [number, data] of Object.entries(this.puzzle.words.across)) {
            this.ctx.fillText(`${number}. ${data.clue}`, 420, clueY);
            clueY += 25;
        }
        
        clueY += 20;
        this.ctx.fillText('Menurun:', 420, clueY);
        clueY += 30;
        
        for (const [number, data] of Object.entries(this.puzzle.words.down)) {
            this.ctx.fillText(`${number}. ${data.clue}`, 420, clueY);
            clueY += 25;
        }
    }

    restart() {
        this.puzzle.userInput = Array(11).fill().map(() => Array(10).fill(''));
        this.selectedCell = null;
        this.direction = 'across';
        this.draw();
    }

    start() {
        this.draw();
    }
}
