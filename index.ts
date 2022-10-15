// this is a library we need, to read text input "easily"
import prompt from 'prompt-sync';

const input = prompt();

//declared generic type of functions because for some reason they are not already present
type transform<A, B> = (arg: A) => B;
type predicate<A> = (arg: A) => boolean;
type reducer<A, B> = (acc: B, val: A) => B;

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
      `\x1b[4${numberNewPlayer + 1}m`, score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

//this function recursively use the indexes to generate the new array
//of dice that the user wanted to keep
const whichDieToKeep = ([index1, ...indexes]: number[], dice: Die[]): Die[] => {
  if (index1 !== undefined)
    return [dice[index1], ...whichDieToKeep(indexes, dice)];

  return [];
}

//this function asks the user one die to keep and manages the check on the input
const indexOfDie = (): number => {

  console.log(`Which of the dice, would you like to keep? Write the number of their position (1-5) or write 0 to stop choosing (if you don't want any, write immediately 0)`)

  const answer = input();

  //VALUTA IL RAGGRUPPARE QUESTI SWITCH IN UNA FUNZIONE, MAGARI HIGH ORDER FUNCTIONS???

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
      console.log("Invalid number, please choose a number between 1-5 or 0 ");
    }

  }

  return indexOfDie();

}

//this function gathers all the indexes for the dice that the user wants to keep
const indexOfDice = (counter: number, indexes: number[]): number[] => {

  if (counter > N_DIES)
    return [];

  const index: number = indexOfDie();

  if (index !== 0) {

    if (indexes.some((i: number) => i === index)) {
      console.log("You can't choose the same die twice");
      return [...indexOfDice(counter, indexes)];
    } else
      return [index, ...indexOfDice(counter + 1, [index, ...indexes])];
  }

  return [];

}

//this function manages the functions for deciding which die to keep. 
//It also maps their indexes because the user inserts them from 1 to 5 
//and instead they are needed from 0 to 4
const askDiceToKeep = (dice: Die[]): Die[] => {

  const indexDiceKeep: number[] = indexOfDice(1, []);
  const newDice: Die[] = indexDiceKeep.length === N_DIES ? dice
    : whichDieToKeep(indexDiceKeep.map((i: number) => i - 1), dice);

  console.log("You kept the following dice: ");
  console.log(newDice);

  return newDice;

}

//this function takes care to transform the combination chosen as a string to a number that refers to the cell of the array of the score owned by the player
const transformCombination = (): number => {

  console.log(`Which of the combination, you'd like to assign your dice points?`)

  const answer = input();

  //VALUTA IL RAGGRUPPARE QUESTI SWITCH IN UNA FUNZIONE, MAGARI HIGH ORDER FUNCTIONS???

  switch (answer) {
    case 'Ones':
      return 0;
    case 'Twos':
      return 1;
    case 'Threes':
      return 2;
    case 'Fours':
      return 3;
    case 'Fives':
      return 4;
    case 'Sixes':
      return 5;
    case 'Three of a kind':
      return 6;
    case 'Four of a kind':
      return 7;
    case 'Full House':
      return 8;
    case 'Small Straight':
      return 9;
    case 'Large Straight':
      return 10;
    case 'Chance':
      return 11;
    case 'YAHTZEE':
      return 12;
    default: {
      console.log("Invalid choice, you must use the names of the combinations, displayed in the point table");
    }

  }

  return transformCombination();

}

//this function takes care of all of the process of asking in which combination wants now the player put its gaines points and its main task is to check that the user is not trying to put the points on a combination already filled
const askCombination = ({ score, ...player }: Player): number => {

  const combinationChosen: number = transformCombination();

  if (score[combinationChosen] !== 0) {
    console.log("You can't assign the score to this combination because you already did in the past! Please choose another one");
    return askCombination({ score, ...player });
  }

  return combinationChosen;

}

//all the functions that are going to take care to evaluate the number of points will be of the following type
type fromDiceToScore = (arg: Die[]) => number;

//this function will take care to convert the combination of the Dies chosen in its score
const getScoreComputation = (combination: number): fromDiceToScore => {

  const sumDice = (dice: Die[]): number => dice.reduce((sum: number, d: Die) => sum + d, 0);

  switch (combination) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return (dice: Die[]): number => sumDice(dice.filter((d: Die) => d === (combination + 1)));
    case 6:
    case 7:
    case 8:
    case 12:
      {

        const frequencyMap: transform<Die[], number[]> = (dice: Die[]): number[] => dice.map((die: Die): number => dice.reduce((sum: number, d1: Die) => sum + (die === d1 ? 1 : 0), 0));

        const isThere = (frequencyMap: transform<Die[], number[]>, condition: predicate<number>, dice: Die[]): boolean => frequencyMap(dice).some((n: number) => condition(n))

        switch (combination) {
          case 6:
          case 7:
            return (dice: Die[]): number =>
              isThere(frequencyMap, (n: number) => n >= (combination - 3), dice) ? sumDice(dice) : 0;
          case 8:
            return (dice: Die[]): number =>
              isThere(frequencyMap, (n: number) => n === 3, dice) &&
                isThere(frequencyMap, (n: number) => n === 2, dice) ? 25 : 0;

          case 12:
            return (dice: Die[]): number =>
              isThere(frequencyMap, (n: number) => n === 5, dice) ? 50 : 0;
        }
      }

    //QUA POSSO GENERALIZZARE SOTTO I DUE CASE E CREARE LA FUNZIONE E PER I DUE CASE DIVERSI MODIFICARE IL PEZZETTO PASSANDO LA FUNZIONE E IL PUNTEGGIO CREDO
    case 9:
      return (dice: Die[]): number => {
        const sortedDice: Die[] = [...dice].sort((a: number, b: number) => a - b)

        const isSmallStr: boolean = [...new Set(sortedDice)].reduce((isIt: boolean, d: Die, i: number, ds: Die[]): boolean => {
          if (i < ds.length - 2 && i > 0)
            isIt = isIt && d === (ds[i + 1] - 1);
          else
            isIt = isIt && (ds[0] === (ds[1] - 1) || ds[ds.length - 1] === (ds[ds.length - 2] + 1));
          return isIt && ds.length >= 4;
        }, true)

        return isSmallStr ? 30 : 0;
      }

    case 10:
      return (dice: Die[]): number => {
        const isLargeStr = [...dice].sort((a: number, b: number) => a - b).reduce((isIt: boolean, d: Die, i: number, ds: Die[]): boolean => {
          if (i < ds.length - 2)
            isIt = isIt && d === (ds[i + 1] - 1);
          else
            isIt = isIt && ds[ds.length - 1] === (ds[ds.length - 2] + 1);

          return isIt;
        }, true)

        return isLargeStr ? 40 : 0;
      }

    case 11:
      return (dice: Die[]): number => sumDice(dice);

  }

  return (dice: Die[]): number => 0;

}

//this function manages the update of the player score
const newPlayerScore = (converter: fromDiceToScore, combination: number, { score, ...player }: Player, dice: Die[]): Player => {

  const newScore = [...score];

  newScore[combination] = converter(dice);

  return { score: newScore, ...player };
}

//this function manages the turn of a player in which he rolls dice
const turn = (currentPlayer: Player, numberRound: 1 | 2 | 3, dice: Die[]): Player => {

  const tempDice: Die[] = [...dice, ...rollDice(N_DIES - dice.length)];

  if (dice.length != 5) {
    console.log("The dice have been rolled");
    console.log("Their values are: ");
    console.log(tempDice);
  }

  if (numberRound !== 3) {



    const keptDice: Die[] = askDiceToKeep(tempDice);

    if (keptDice.length === N_DIES)
      return turn(currentPlayer, 3, keptDice);

    return turn(currentPlayer, numberRound + 1 as 1 | 2 | 3, keptDice);

  } else {

    const combination: number = askCombination(currentPlayer);

    return newPlayerScore(getScoreComputation(combination), combination, currentPlayer, tempDice);

  }

  return { ...currentPlayer };

}

const getWinner = (players: Player[]): Player[] => {
  // return players.map((player: Player[], i: number) => ({ player: player, num: i })).sort()//posso fare il sort sul number e poi filter dei player con il punteggio piu alto, ma devo ptims prt ciascuno calcolare il totale dei loro punti 

  interface playerWScore {
    player: Player,
    total: number
  }

  const sortedByPoints: playerWScore[] = players
    .map((player: Player): playerWScore =>
    ({
      player: player,
      total: player.score
        .reduce((sum: number, n: number): number => sum = sum + n, 0)
    })
    )
    .sort((p1: playerWScore, p2: playerWScore) => p2.total - p1.total);

  return sortedByPoints
    .filter(({ player, total }: playerWScore) => total === sortedByPoints[0].total)
    .map(({ player, total }: playerWScore): Player => player);
}

//this function manages all the middle part of the game in which players actually play
const midGame = (players: Player[], playerNumber: number, numberRound: number): Player[] => {

  if (playerNumber === 0 && numberRound === 14)
    return getWinner(players);

  if (playerNumber === 0)
    console.log("Turn Number #" + numberRound);

  console.log(players);
  console.log("It's your turn, color " + getColor(players[playerNumber].color));

  const newPlayerState: Player = turn(players[playerNumber], 1, []);

  const newPlayers: Player[] = players;
  newPlayers[playerNumber] = newPlayerState;

  const next: number = (playerNumber + 1) % players.length;

  return midGame(newPlayers, next, next === 0 ? numberRound + 1 : numberRound);
}

const getColor = (color: string): string => {
  switch (color) {
    case '\x1b[42m':
      return 'GREEN';
    case '\x1b[43m':
      return 'YELLOW';
    case '\x1b[44m':
      return 'BLUE';
    case '\x1b[45m':
      return 'MAGENTA';
  }

  return '????'
}

const announceWinner = (players: Player[]): void => {

  console.log("The game is finished.")

  if (players.length === 1)
    console.log(`...and the winner is...
    ...COLOR ${getColor(players[0].color)}. Congratulations!`);
  else
    console.log(`...ugh... it seems there's a draw!
    So the winners are...
    ... COLOR ${players.reduce((sum: string, p: Player): string => sum = sum + ", " + getColor(p.color), '')}. Congratulations!`);
}

//this function will manage the structure of the game itself
//referring to any possible and needed state of the game
const game = (): void => {
  const players: Player[] = startGame();

  //return the winner(s) or null if there's a total draw
  const winner: Player[] = midGame(players, 0, 1);

  announceWinner(winner);

  //fai funzione announcewinner che controlla se ne e' piu' di uno con lo stesso score o solo uno e in caso scrive la cosa adatt
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
