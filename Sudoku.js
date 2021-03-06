class Sudoku {
    constructor() {
        this.board = document.getElementById("boards-container");
        this.root = document.documentElement;
        this.dimensionInput = document.createElement('input');
        this.boardDimension = 0;
        this.questionContainer = document.getElementById('question-container');
    }

    solve() {
        // Sets in motion the solving of the sudoku puzzle
        this.firstQuestion();
    }

    /************************* FIRST QUESTION SIZE *****************************/
    firstQuestion() {
        this.addQuestion("What size dimension is the board (4 for 4x4 board, etc.)");
        this.addQuestionInput();
        this.questionSubmit(this.firstQuestionEvent, 'first-q-submit', 'submit');
    }

    addQuestionInput(){
        // Add input to first question
        this.dimensionInput.setAttribute('type', 'number');
        this.questionContainer.appendChild(this.dimensionInput);
    }

    isSquare = (n) => {
        // Used in firstQuestionEvent to make sure value is square before creating board
        return n > 0 && Math.sqrt(n) % 1 === 0;
    }

    firstQuestionEvent = () => {
        this.questionContainer.innerHTML = "";
        this.dimension = this.dimensionInput.value; // Set class board dimension
        if (this.isSquare(this.dimension)) {
            this.createBoard();
        }else{
            // If the dimensions arent valid
            this.newSolver();
            let errorMessage = document.createElement('p');
            errorMessage.textContent = "Please input valid dimensions."
            this.questionContainer.appendChild(errorMessage);
        }
    }


    /************************** QUESTION/ INFO LOGIC **************************/
    addQuestion(text) {
        // Add first question and the description of how to use skeleton of board
        let firstQuestion = document.createElement('p');
        firstQuestion.textContent = text;
        this.questionContainer.appendChild(firstQuestion);
    }

    questionSubmit(event,id,buttonText){
        // Add submit buttons to first question and skeleton
        let firstQSubmit = document.createElement('button');
        firstQSubmit.setAttribute('id',id);
        firstQSubmit.innerHTML = buttonText;
        this.questionContainer.appendChild(firstQSubmit);
        
        firstQSubmit.addEventListener('click', () => {
            event();
        });
    }

    /************************** BOARD SKELETON LOGIC **************************/

    createBoard() {
        // Create sudoku board skeleton, add the variables to css root
        this.root.style.setProperty('--grid-rows', this.dimension);
        this.root.style.setProperty('--grid-cols', this.dimension);

        this.printBoardToScreen('', false);

        // Add description of what to do with skeleton
        this.addQuestion(`Fill the board with the starting values 
        in their respective cells, then click submit.`);

        // Create board submit button
        this.questionSubmit(this.setBoardEvent, 'board-submit','solve');
    }

    setBoardEvent = () => {
        // Called in createBoard() as parameter to questionSubmit()
        this.questionContainer.innerHTML = ""; // Clear the question container
        let sudokuPreAnswer = this.setBoardSkeleton(); // Get skeleton into array
        this.recursiveSolver(sudokuPreAnswer);
        this.printBoardToScreen(sudokuPreAnswer, true);
        this.questionSubmit(this.newSolver,'new-solve-submit','solve another');
    }

    setBoardSkeleton() {
        // Take users input after submit and create skeleton array of board
        let sudokuPreAnswer = [];
        for (let i = 0; i < this.dimension; i++) {
            let row = [];
            for (let j = 0; j < this.dimension; j++) {
                let cell = document.getElementById('row-' + i + '-' + 'col-' + j);
                let cellVal = cell.value;
                cellVal == '' ? row[j] = 0 : row[j] = parseInt(cellVal);
            }
            sudokuPreAnswer.push(row); // Add row to array
        }
        return sudokuPreAnswer;
    }

    printBoardToScreen(sudokuBoard, read) {
        this.board.innerHTML = ""; // Clear board container

        let skeleton = document.createElement('div');
        skeleton.setAttribute('class', 'board-container');

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                let cell = document.createElement('input');
                if (sudokuBoard != '') cell.value = sudokuBoard[i][j];
                cell.setAttribute('class', 'cell');
                cell.setAttribute('id', 'row-' + i + '-' + 'col-' + j);
                cell.readOnly = read;
                skeleton.appendChild(cell);
            }
        }
        this.board.appendChild(skeleton);
    }

    newSolver=()=>{
        this.questionContainer.innerHTML="";
        this.board.innerHTML="";
        let sudoku = new Sudoku();
        sudoku.solve();

    }
    /************************** PUZZLE SOLVING LOGIC **************************/

    recursiveSolver(preBoard) {
        // Solve the sudoku puzzle recursively
        for (let i = 0; i < preBoard.length; i++) {
            // Loop throught the rows
            for (let j = 0; j < preBoard.length; j++) {
                // Loop through columns
                if (preBoard[i][j] == 0) {
                    // If place needs a value input
                    for (let cellVal = 1; cellVal <= preBoard.length; cellVal++) {
                        if (this.checkRow(preBoard[i], cellVal) && this.checkCol(preBoard,j, cellVal) && this.checkSquare(preBoard, i, j, cellVal)) {
                            preBoard[i][j] = cellVal;
                            if (this.recursiveSolver(preBoard)) {
                                // If upstream returns true, then pass it down
                                return true;
                            };
                            // If upstream returns false, then set this cell back
                            // to 0 and try next value
                            preBoard[i][j] = 0;
                        }
                    }
                    // If no value works in the range then pass false back down
                    return false;
                }
            }
        }
        return true; // If no qualms, puzzle solved and return true
    }

    checkRow(row, val) {
        // Check that the row doesnt contain the same number
        return !row.includes(val);
    }

    checkCol(preBoard,col, val) {
        // Check that the col doesnt contain the same number
        let useValue = true;
        for (let i = 0; i < this.dimension; i++) {
            // Loop through all values in the column and if find duplicate then false
            if (preBoard[i][col] == val) {
                useValue = false;
            }
        }
        return useValue;
    }

    checkSquare(preBoard,outerRow, outerCol, value) {
        let innerDimension = Math.sqrt(preBoard.length);
        // Check that inner box doesnt contain any doubles
        let sectionRowDivision = parseInt(outerRow / innerDimension);
        let sectionRow = sectionRowDivision * innerDimension; // Zero to which section of row

        let sectionColDivision = parseInt((outerCol) / innerDimension);
        let sectionCol = sectionColDivision * innerDimension; // Zero to the section of col

        // This will make sure the surrounding square box doesnt hold the value
        for (let row = 0; row < innerDimension; row++) {
            for (let col = 0; col < innerDimension; col++) {
                // If value is found in the box then return false
                if (preBoard[sectionRow + row][sectionCol + col] == value) return false;
            }
        }
        return true; // If true returned then can use the value
    }
}

let sudoku = new Sudoku();
sudoku.solve();

/*
https://css-tricks.com/updating-a-css-variable-with-javascript/
https://stackoverflow.com/questions/57550082/creating-a-16x16-grid-using-javascript
https://stackoverflow.com/questions/30919111/whats-the-best-way-in-javascript-to-test-if-a-given-parameter-is-a-square-numbe
https://stackoverflow.com/questions/3397113/how-to-remove-focus-border-outline-around-text-input-boxes-chrome
*/