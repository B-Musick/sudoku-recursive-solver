class Sudoku{
    constructor(){
        this.board = document.createElement('div');
        this.root = document.documentElement;
        this.boardDimension = 0;
        this.questionContainer = document.getElementById('question-container');
    }

    solve() {
        this.firstQuestion();
    }


    firstQuestion() {
        // Add question to first div
        let firstQuestion = document.createElement('div');
        firstQuestion.textContent = "What size dimension is the board (4 for 4x4 board, etc.)";
        this.questionContainer.appendChild(firstQuestion);

        // Add input to first question
        let dimensionInput = document.createElement('input');
        dimensionInput.setAttribute('type', 'text');
        this.questionContainer.appendChild(dimensionInput);

        // Add submit button
        let firstQSubmit = document.createElement('button');
        firstQSubmit.innerHTML = 'Submit';
        this.questionContainer.appendChild(firstQSubmit);

        firstQSubmit.addEventListener('click', () => {
            this.boardDimension = dimensionInput.value; // Set class board dimension
            this.createBoard();
        })
    }

    recursiveSolver() {
        for (let i = 0; i < this.board.length; i++) {
            // Loop throught the rows
            for (let j = 0; j < this.board.length; j++) {
                // Loop through columns
                if (this.board[i][j] == 0) {
                    // If place needs a value input
                    for (let cellVal = 1; cellVal <= this.board.length; cellVal++) {
                        if (this.checkRow(this.board[i], cellVal) && this.checkCol(j, cellVal) && this.checkSquare(this.board, i, j, cellVal)) {
                            this.board[i][j] = cellVal;
                            console.log(this.board);

                            if (solveSudoku(this.board)) {

                                return true;
                            };
                            this.board[i][j] = 0;
                        }
                    }
                    return false;
                }

            }
        }
        return true;
    }

    checkRow(row, val) {
        // Check that the row doesnt contain the same number
        return !row.includes(val);
    }

    checkCol(col, val) {
        // Check that the col doesnt contain the same number
        let useValue = true;
        for (let i = 0; i < this.dimension; i++) {
            // Loop through all values in the column and if find duplicate then false
            if (this.board[i][col] == value) {
                useValue = false;
            }
        }
        return useValue;
    }

    checkSquare(outerRow, outerCol, value) {
        let innerDimension = Math.sqrt(this.board.length);
        // Check that inner box doesnt contain any doubles
        let sectionRowDivision = parseInt(outerRow / innerDimension);
        let sectionRow = sectionRowDivision * innerDimension; // Zero to which section of row

        let sectionColDivision = parseInt((outerCol) / innerDimension);
        let sectionCol = sectionColDivision * innerDimension; // Zero to the section of col

        // This will make sure the surrounding square box doesnt hold the value
        for (let row = 0; row < innerDimension; row++) {
            for (let col = 0; col < innerDimension; col++) {
                // If value is found in the box then return false
                if (this.board[sectionRow + row][sectionCol + col] == value) return false;
            }
        }
        return true; // If true returned then can use the value
    }

    createBoard() {
        this.board.setAttribute('id', 'board-container');

        // Create sudoku board, add the variables to css root
        this.root.style.setProperty('--grid-rows', this.dimension);
        this.root.style.setProperty('--grid-cols', this.dimension);

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                let cell = document.createElement('input');
                cell.setAttribute('class', 'cell');
                cell.setAttribute('id', 'row-' + i + '-' + 'col-' + j)
                this.board.appendChild(cell);
            }
        }
        this.questionContainer.appendChild(this.board);

        // Create board submit button
        let boardSubmit = document.createElement('button');
        boardSubmit.setAttribute('id', 'board-submit');
        boardSubmit.innerHTML = 'Submit';
        this.questionContainer.appendChild(boardSubmit);

        let sudokuPreAnswer = [];

        // Listen for when user submits their board
        boardSubmit.addEventListener('click', () => {
            for (let i = 0; i < this.dimension; i++) {
                let row = [];
                for (let j = 0; j < this.dimension; j++) {
                    let cell = document.getElementById('row-' + i + '-' + 'col-' + j);
                    let cellVal = cell.value;
                    cellVal == '' ? row[j] = 0 : row[j] = parseInt(cellVal);
                }
                sudokuPreAnswer.push(row); // Add row to array
            }
            this.board = sudokuPreAnswer;

            this.recursiveSolver();
            
            // Print new board
            for (let i = 0; i < this.dimension; i++) {
                for (let j = 0; j < this.dimension; j++) {
                    let cell = document.createElement('input');
                    cell.value = this.board[i][j];
                    cell.setAttribute('class', 'cell');
                    cell.readOnly = true;
                    cell.setAttribute('id', 'row-' + i + '-' + 'col-' + j)
                    this.board.appendChild(cell);
                }
            }
            this.questionContainer.appendChild(this.board);
        });

    }
}