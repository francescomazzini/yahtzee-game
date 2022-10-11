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

const N_DIES: number = 5;

type Die = 1 | 2 | 3 | 4 | 5 | 6;

//this function creates the number of player wanted and set up their colors and score (default value)
const createPlayer = (numberNewPlayer: number): Player[] => {

  if (numberNewPlayer < 1)
    return [];

  return [...createPlayer(numberNewPlayer - 1), {
    color:
      `\x1b[4${numberNewPlayer + 1}m`, score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];

}


//this function will manage the setup part (beginning) of the game
const startGame = (): Player[] => {

  console.log('Welcome to Yahtzee Game!');

  //magari dovrei separare e emettere questo in un'altra funzione per ridurre l'uso dell'interazione

  const numberOfPlayers: number = getNumberOfPlayer();

  return createPlayer(numberOfPlayers);

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

//this functions roll a number of dice
const rollDice = (numberDice: number): Die[] => {
  if (numberDice < 1)
    return [];
  else
    return [(Math.trunc(Math.random() * 6) + 1) as Die, ...rollDice(numberDice - 1)];
}

const whichDieToKeep = ([index1, ...indexes]: number[], dice: Die[]): Die[] => {
  if (indexes.length !== 0)
    return [dice[index1], ...whichDieToKeep(indexes, dice)];

  return [];
}

const indexOfDie = (): number => {

  const answer = input("Which of the dice, would you like to keep? Write its number (1-5) or write 0 to stop choosing (if you don't want any, write immediately 0)");

  switch (answer) {
    case '0':
      return 0;
    case '1':
      return 1;
    case '2':
      return 2;
    case '3':
      return 3;
    case '4':
      return 4;
    case '5':
      return 5;
    default: {
      console.log("Invalid number, please choose a number netween 1-5 or 0 ");
      return indexOfDie();
    }
  }

}

const indexOfDice = (counter: number, indexes: number[]): number[] => {

  if (counter > 5)
    return [];

  const index = indexOfDie();

  if (index !== 0) {
    //farei qua che prende l'indice e poi un controllo dopo e poi un return dopo dopo come stavo facendo ma no nso se va bene
    if (indexes.some((i: number) => i === index)) {
      console.log("You can't choose the same die twice");
      return [index, ...indexOfDice(counter,)];
    } else
      return [index, ...indexOfDice(counter + 1)];
  }

  return [];

}

const askDiceToKeep = (dice: Die[]): Die[] => {

  const

}

//this function manages the turn of a player in which he rolls dies
const turn = (currentPlayer: Player, numberRound: 1 | 2 | 3 /*| 4?*/, dice: Die[]): Player => {

  const tempDice: Die[] = [...dice, ...rollDice(N_DIES - dice.length)];

  if (numberRound !== 3) {
    //stampa i dice attuali
    //quali vuoi tenere?
    //ricordati di mappare gli indexes a meno 1 per lo user che li mette da 1...x
    //controlla che la lunghezza degli index non sia 5 se no si tiene tutto
    //mi sa che tutta  sta roba va messa in which die to keep e poi lo scompongo
    const keptDice: Die[] = askDiceToKeep(tempDice);
  } else {
    //calcola punteggio
    //chiedi per quale vuole mettere i punti
    //inserisci i punti
    // ritorna il player
  }

  return { color: "asa", score: [0, 0] };

}

//this function manages all the middle part of the game in which players actually play
const midGame = (players: Player[], playerNumber: number): Player[] | null => {

  //print
  //chiama il turn del primo player
  //se non ci sta un winner continua col player dopo richiamando ricorsivamente questa funzione che si ferma solo quando il gioco potrebbe esser finito. Passa il player del turno a turn()




  return null;
}

//this function will manage the structure of the game itself
//referring to any possible and needed state of the game
const game = (): void => {
  const players: Player[] = startGame();

  //return the winner(s) or null if there's a total draw
  const winner: Player[] | null = midGame(players, 0);

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
