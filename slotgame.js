// User deposits money
// Determining number of lines to bet on
// Collect bet amount
// Spin the slot machine
// Checking if the user won
// Displaying the results, giving winners, and updating the user's balance
// Play again button

//User deposits money
const prompt = require("prompt-sync")();



//Defining variables for the slot machine and symbols for rows
const ROWS = 3;
const COLS = 3;

//defining global variables 
const SYMBOLS_COUNT = {
    "🍒": 2,
    "🍊": 4,
    "🍇": 6,
    "🍌": 8,
}

const SYMBOL_VALUES = {
    "🍒": 5,
    "🍊": 4,
    "🍇": 3,
    "🍌": 2,
}


//Deposit function
const deposit = () => {
    //asking user for valid deposit
        const depositAmount = prompt("How much would you like to deposit? ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Please enter a valid number.");
        } 
        else {
            return numberDepositAmount;
        }
    };

// Bet lines
const getNumberofLines = () => {
    //Get number of lines and rows user will bet on
    const Lines = prompt("How many lines would you like to bet on? (1-3) ");
    const numberOfLines = parseFloat(Lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
        console.log("Please enter a valid number.");
    } else {
        return numberOfLines;
    }
};

//Allows us to get total bet
//Bet is per line based on balance
const getBet = (balance, Lines) => {
    while (true) {
        const bet = prompt("How much will you bet per line? ");
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / Lines) {
            console.log("Please enter a valid number.");
        } else if (numberBet > balance) {
            console.log("You don't have enough money.");
        } else {
            return numberBet;
        }
    }
};

//spinning slot machine by generating random symbols and randomly selecting them
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    //Defining counter variable for iterations we need to perform
    //As soon as it's eaqual to, we stop
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        //loops through the rows
        for (let j = 0; j < ROWS; j++) {
            //Generating a random index and multiplying it by our length of symbols (4).
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            //Pushing the selected symbol into the reels array then splicing it so no duplicates.
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }


    return reels;
};
//helps transpose all columns into rows to check for user winnings and ease of print
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

//Prints rows in nice formatting
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
};

//Finds and checks for winnings from user
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    //did win
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        //didnt win
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }

    return winnings;
};

//Continue to play game until inefficient amount or until user is finished.
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("Your balance is $" + balance);
        const numberOfLines = getNumberofLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0) {
            console.log("Inefficient amount left.")
            break;
        }
        const playAgain = prompt("Do you want to play again? (y/n)");
        if (playAgain != "y") break 
    }
}

game();
