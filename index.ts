// this is a library we need, to read text input "easily"
import prompt from 'prompt-sync';

const input = prompt();

// these are some codes to get the console to print in colors
// see more details here:
// https://bit.ly/3T8YcDQ
const Reset = "\x1b[0m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

//define the player interface
interface Player {
  //color can be green, yellow, blue or magenta
  color: string,
  // color: string,
  score: number[]
}

//this function creates the number of player wanted and set up their colors and score (default value)
const createPlayer = (players: Player[], numberNewPlayer: number): Player[] => {

  if (numberNewPlayer < 1)
    return players;

  return [...createPlayer(players, numberNewPlayer - 1), {
    color:
      `\x1b[4${numberNewPlayer + 1}m`, score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];

}


//this function will manage the setup part (beginning) of the game
const startGame = (): Player[] => {

  console.log('Welcome to Yahtzee Game!');

  const numberOfPlayers: number = getNumberOfPlayer();

  return createPlayer([], numberOfPlayers);

}

//this function will manage the correctness of the input of the 
//number of players (a value between 1-4) and return the correct value
//when received
const getNumberOfPlayer = (): number => {
  const answer = input(`How many people are going to play? (1-4) `)
  switch (answer) {
    case "1": return 1
    case "2": return 2
    case "3": return 3
    case "4": return 4
    default: {
      console.log("Invalid number, please choose a number of players(1-4) ")
      return getNumberOfPlayer();
    }
  }
}

//this function will manage the structure of the game itself
//referring to any possible and needed state of the game
const game = (): void => {
  const players: Player[] = startGame();
  console.log(players);
}

game();






// const throwDie = (): number => Math.trunc(Math.random() * 6) + 1;


// this is a small example to show how the pieces fit together
// const example = (): void => {
//   console.log(`type anything to throw a die, or ${BgRed}'exit'${Reset} to quit`);
//   const command: string = input();
//   if (command == 'exit') {
//     console.log(`${BgGreen}See you next time!${Reset}`);
//   } else {
//     const die = throwDie();
//     console.log(`you threw: ${BgBlue} ${die} ${Reset}`);
//     example();
//   }
// }

// example();
