let questionContainer = document.getElementById('question-container');

// Add question to first div
let firstQuestion = document.createElement('div');
firstQuestion.textContent = "What size dimension is the board (4 for 4x4 board, etc.)";
questionContainer.appendChild(firstQuestion);

// Add input to first question
let dimensionInput = document.createElement('input');
dimensionInput.setAttribute('type','text');
questionContainer.appendChild(dimensionInput);

// Add submit button
let firstQSubmit = document.createElement('button');
firstQSubmit.innerHTML = 'Submit';
questionContainer.appendChild(firstQSubmit);

let boardDimension = false;

firstQSubmit.addEventListener('click',()=>{
    boardDimension = dimensionInput.value;
    createSudokuBoard(boardContainer,boardDimension);
    console.log(boardDimension);
})

let boardContainer = document.createElement('div');
boardContainer.setAttribute('id', 'board-container');

let root = document.documentElement;

let createSudokuBoard =(boardContainer,boardDimension)=>{
    // Create sudoku board, add the variables to css root
    root.style.setProperty('--grid-rows',boardDimension);
    root.style.setProperty('--grid-cols',boardDimension);

    for(let i =0;i<boardDimension;i++){
        for (let j = 0; j < boardDimension; j++) {
            let cell = document.createElement('input');
            cell.setAttribute('class', 'cell');
            cell.setAttribute('id', 'row-' + i + '-' + 'col-' + j)
            boardContainer.appendChild(cell);            
        }
    }
    questionContainer.appendChild(boardContainer);

    // Create board submit button
    let boardSubmit = document.createElement('button');
    boardSubmit.setAttribute('id','board-submit');
    boardSubmit.innerHTML = 'Submit';
    questionContainer.appendChild(boardSubmit);

    let sudokuPreAnswer = [];

    // Listen for when user submits their board
    boardSubmit.addEventListener('click',()=>{
        for (let i = 0; i < boardDimension; i++) {
            let row = [];
            for (let j = 0; j < boardDimension; j++) {
                let cell = document.getElementById('row-' + i + '-' + 'col-' + j);
                let cellVal = cell.value;
                cellVal=='' ? row[j]=0:row[j]=parseInt(cellVal);
            }
            sudokuPreAnswer.push(row); // Add row to array
        }
        
        solveSudoku(sudokuPreAnswer);
        for (let i = 0; i < boardDimension; i++) {
            for (let j = 0; j < boardDimension; j++) {
                let cell = document.createElement('input');
                cell.value = sudokuPreAnswer[i][j];
                cell.setAttribute('class', 'cell');
                cell.setAttribute('id', 'row-' + i + '-' + 'col-' + j)
                boardContainer.appendChild(cell);
            }
        }
        questionContainer.appendChild(boardContainer);

    });


}

// When user submits values in the board, get the values and solve puzzle
// let boardSubmit = document.getElementById('board-submit');
let solveSudoku =(board)=>{
    for(let i = 0;i<board.length;i++){
        // Loop throught the rows
        for(let j = 0; j<board.length;j++){
            // Loop through columns
            if(board[i][j]==0){
                // If place needs a value input
                for(let cellVal = 1;cellVal<=board.length;cellVal++){
                    if(checkRow(board[i],cellVal)&&checkCol(board[j],cellVal)&&checkSquare(board,i,j,cellVal)){
                        board[i][j]=cellVal;
                        console.log(board);

                        if(solveSudoku(board)){

                            return true;
                        };
                        board[i][j]=0;
                    }
                }
                return false;
            }

        }
    }
    return true;
    
}

let checkRow=(row,val)=>{
    // Check that the row doesnt contain the same number
    return !row.includes(val);
}

let checkCol = (col, val) => {
    // Check that the col doesnt contain the same number
    let useValue = true;
    for (let i = 0; i < this.dimension; i++) {
        // Loop through all values in the column and if find duplicate then false
        if (board[i][col] == value) {
            useValue = false;
        }
    }
    return useValue;
}

let checkSquare=(board,outerRow,outerCol, value)=>{
    let innerDimension = Math.sqrt(board.length);
    // Check that inner box doesnt contain any doubles
    let sectionRowDivision = parseInt(outerRow / innerDimension);
    let sectionRow = sectionRowDivision * innerDimension; // Zero to which section of row

    let sectionColDivision = parseInt((outerCol) / innerDimension);
    let sectionCol = sectionColDivision * innerDimension; // Zero to the section of col

    // This will make sure the surrounding square box doesnt hold the value
    for (let row = 0; row < innerDimension; row++) {
        for (let col = 0; col < innerDimension; col++) {
            // If value is found in the box then return false
            if (board[sectionRow + row][sectionCol + col] == value) return false;
        }
    }
    return true; // If true returned then can use the value
}


/*
https://css-tricks.com/updating-a-css-variable-with-javascript/
https://stackoverflow.com/questions/57550082/creating-a-16x16-grid-using-javascript
*/