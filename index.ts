// this is a library we need, to read text input "easily"
import prompt from 'prompt-sync';


//------------------------

//INITIAL DECLARATIONS

//------------------------

const input = prompt();

//declared generic type of functions because for some reason they are not already present
export type transform<A, B> = (arg: A) => B;
export type predicate<A> = (arg: A) => boolean;
export type reducer<A, B> = (acc: B, val: A) => B;

export type Die = 1 | 2 | 3 | 4 | 5 | 6;

//all the functions that are going to take care to evaluate the number of points will be of the following type
export type fromDiceToScore = (arg: Die[]) => number;

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

interface Score {
  name: string,
  position: number,
  value: number,
  used: boolean //says if the combination has already been chosen
}


//define the player interface
interface Player {
  //color can be green, yellow, blue or magenta
  color: string,
  // color: string,
  score: Score[]
}

const N_DIES: number = 5;


const getNameScore = (): string[] => ["Ones", "Twos", "Threes", "Fours", "Fives",
  "Sixes", "Three of a kind", "Four of a kind", "Full house", "Small straight",
  "Large straight", "Chance", "YAHTZEE"];

//------------------------

//DICE UTILITIES

//------------------------

//function that sums all the dice
const sumDice = (dice: Die[]): number => dice.reduce((sum: number, d: Die) => sum + d, 0);

//this function maps all the dice to an array in which for each position there is the number of times that number appears in the array
const frequencyMap: transform<Die[], number[]> = (dice: Die[]): number[] => dice.map((die: Die): number => dice.reduce((sum: number, d1: Die) => sum + (die === d1 ? 1 : 0), 0));

//this function checks if in the frequency map result if there is such a number(given specifically later, also the criteria (=== or >=) is given later), meaning that a certain die is present a certain number of times in the dice array
const isThere = (frequencyMap: transform<Die[], number[]>, condition: predicate<number>, dice: Die[]): boolean => frequencyMap(dice).some((n: number) => condition(n))

//this function sorts the dice returning a new array (thats why [...dice] because sort() sorts in place)
const sortedDice = (dice: Die[]) => [...dice].sort((a: number, b: number) => a - b);

//this functions checks if there are a straight line of a certain number of dice (this is given later with specific conditions, it's not very clear and abstract but these two refer to really specific cases and making them more reusable and abstract in a cleaner way would have neem to time expensive, this is anyway a way to avoid code duplication) 
const isStraight = (dice: Die[], conditionIndex: predicate<number>, conditionEdgeCase: predicate<Die[]>): boolean => {
  return dice.reduce((isIt: boolean, d: Die, i: number, ds: Die[]): boolean => {
    if (i < ds.length - 2 && conditionIndex(i))
      isIt = isIt && d === (ds[i + 1] - 1);
    else
      isIt = isIt && (conditionEdgeCase(ds) || ds[ds.length - 1] === (ds[ds.length - 2] + 1));
    //this check on the length is made only for the case of the small straight where removing the duplicates could cause a fake approval of the condition 
    return isIt && ds.length >= 4;
  }, true);
}

//return a function that computes the sum of all the dice, after having filtered only those which are of a specific number given by the combination type
const diceSumIfNum = (num: number): fromDiceToScore => (dice: Die[]): number => sumDice(dice.filter((d: Die) => d === num));

const numOfAKind = (num: number): fromDiceToScore => (dice: Die[]): number =>
  isThere(frequencyMap, (n: number) => n >= (num), dice) ? sumDice(dice) : 0;

const fullHouse = (numPoints: number): fromDiceToScore => (dice: Die[]): number =>
  isThere(frequencyMap, (n: number) => n === 3, dice) &&
    isThere(frequencyMap, (n: number) => n === 2, dice) ? numPoints : 0;

const YAHTZEE = (numPoints: number): fromDiceToScore => (dice: Die[]): number =>
  isThere(frequencyMap, (n: number) => n === 5, dice) ? numPoints : 0;

//for small straight we avoid to have the duplicates annoying the calculation using the set object instead. The condition allows to avoid to check the first and last result in a strict way, because on of the two can also not respect the criteria (since the straihgtness should be only given by at least 4 numbers)
const isSmallStraight = (numPoints: number): fromDiceToScore => (dice: Die[]): number => isStraight([...new Set(sortedDice(dice))], (i: number) => i > 0, (ds: Die[]) => ds[0] === (ds[1] - 1)) ? numPoints : 0;

//here instead is more strict, therefore there cannot be duplicates, no first and last allowed to not respect the criteria
const isLargeStraight = (numPoints: number): fromDiceToScore => (dice: Die[]): number => isStraight(sortedDice(dice), (i: number) => true, (ds: Die[]) => false) ? numPoints : 0;

//chanche just sums the number of the dice
const Chance = (): fromDiceToScore => (dice: Die[]): number => sumDice(dice);

//this functions roll a number of dice
const rollDice = (numberDice: number): Die[] => {
  if (numberDice < 1)
    return [];
  else
    return [(Math.trunc(Math.random() * 6) + 1) as Die, ...rollDice(numberDice - 1)];
}

//------------------------

//GAME SETUP

//------------------------

//it creates the number of player wanted and set up their colors and score (default value)
const createPlayer = (numberNewPlayer: number): Player[] => {

  if (numberNewPlayer < 1)
    return [];

  return [...createPlayer(numberNewPlayer - 1), {
    color:
      `\x1b[4${numberNewPlayer + 1}m`, score: setUpScore()
  }];

}

//this function handles the first setup of the score
const setUpScore = (): Score[] => {
  const names: string[] = getNameScore();
  const score: Score[] = [];

  for (let i = 0; i < names.length; i++) {
    score.push({
      name: names[i],
      value: 0,
      used: false,
      position: i
    }
    );
  }

  return score;
}

//this function will manage the setup part (beginning) of the game
const startGame = (): Player[] => {

  const numberOfPlayers: number = getNumberOfPlayer();

  return createPlayer(numberOfPlayers);

}

//------------------------

//GAME MECHANICS

//------------------------


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
      printInformation("Invalid number, please choose a number of players(1-4) ")
      return getNumberOfPlayer();
    }
  }
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

  const answer = input();

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
      printInformation("Invalid number, please choose a number between 1-5 or 0 ");
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
      printInformation("You can't choose the same die twice");
      return [...indexOfDice(counter, indexes)];
    } else
      return [index, ...indexOfDice(counter + 1, [index, ...indexes])];
  }

  return [];

}

//this function manages the functions for deciding which die to keep. 
//It also maps their indexes because the user inserts them from 1 to 5 
//and instead they are needed from 0 to 4
const askDiceToKeep = (dice: Die[], player: Player): Die[] => {

  printInformation(colorString(player.color, "Choose the dice to keep writing their position (1-5) or (0) when you have finished"));
  const indexDiceKeep: number[] = indexOfDice(1, []);
  const newDice: Die[] = indexDiceKeep.length === N_DIES ? dice
    : whichDieToKeep(indexDiceKeep.map((i: number) => i - 1), dice);

  return newDice;

}


//this function takes care of all of the process of asking in which combination wants now the player put its gaines points and it also checks that the user is not trying to put the points on a combination already filled
const askCombination = (player: Player): number => {

  printInformation(colorString(player.color, "Which of the combination, you'd like to assign your dice points? ${Reset}"));

  const answer = input();

  const combination: Score | undefined = player.score.find((s: Score) => s.name === answer);

  if (combination === undefined) {
    printInformation("Invalid choice, you must use the names of the combinations, displayed in the point table");
    return askCombination(player);
  }

  if (combination.used === true) {
    printInformation("You can't assign the score to this combination because you already did in the past! Please choose another one");
    return askCombination(player);
  }

  return combination.position;

}


//this function will take care to convert the combination of the Dies chosen in its score
const getScoreComputation = (combination: number): fromDiceToScore => {

  switch (combination) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return diceSumIfNum(combination + 1);
    case 6:
    case 7:
      return numOfAKind(combination - 3);
    case 8:
      return fullHouse(25);
    case 12:
      return YAHTZEE(50);
    case 9:
      return isSmallStraight(30);
    case 10:
      return isLargeStraight(40);
    case 11:
      return Chance();

  }

  return (dice: Die[]): number => 0;

}

//this function manages the update of the player score
const newPlayerScore = (converter: fromDiceToScore, combination: number, { score, ...player }: Player, dice: Die[]): Player => {

  const beforeScore: Score[] = score.slice(0, combination);
  const afterScore: Score[] = score.slice(combination + 1, score.length);
  const currentScore: Score = score[combination];

  return {
    score: [...beforeScore,
    {
      value: converter(dice),
      used: true,
      name: currentScore.name,
      position: currentScore.position
    },
    ...afterScore],
    ...player
  };

}



const getTotalScore = (player: Player): number => player.score.reduce((sum: number, n: Score): number => sum = sum + n.value, 0)

const getWinner = (players: Player[]): Player[] => {

  interface playerWScore {
    player: Player,
    total: number
  }

  const sortedByPoints: playerWScore[] = players
    .map((player: Player): playerWScore =>
    ({
      player: player,
      total: getTotalScore(player)
    })
    )
    .sort((p1: playerWScore, p2: playerWScore) => p2.total - p1.total);

  return sortedByPoints
    .filter(({ player, total }: playerWScore) => total === sortedByPoints[0].total)
    .map(({ player, total }: playerWScore): Player => player);
}


//this function manages the turn of a player in which he rolls dice
const turn = (currentPlayer: Player, numberRound: 1 | 2 | 3, dice: Die[]): Player => {

  const tempDice: Die[] = [...dice, ...rollDice(N_DIES - dice.length)];

  if (dice.length != 5) {
    printInformation(`The dice have been rolled
Their values are: 
${prettyStringDice(tempDice)}`);
  }

  if (numberRound !== 3) {

    const keptDice: Die[] = askDiceToKeep(tempDice, currentPlayer);

    printInformation(`You kept the following dice: 
${prettyStringDice(keptDice)}
`);

    if (keptDice.length === N_DIES)
      return turn(currentPlayer, 3, keptDice);

    return turn(currentPlayer, numberRound + 1 as 1 | 2 | 3, keptDice);

  } else {

    const combination: number = askCombination(currentPlayer);

    return newPlayerScore(getScoreComputation(combination), combination, currentPlayer, tempDice);

  }

  return { ...currentPlayer };

}

//computes who's the next player to play
const whosNext = (playerNumber: number, nPlayers: number): number => (playerNumber + 1) % nPlayers;

//computes which number is the next round
const nextRound = (playerNumber: number, currentRound: number): number => playerNumber === 0 ? currentRound + 1 : currentRound;

//this function manages all the middle part of the game in which players actually play
const midGame = (players: Player[], playerNumber: number, numberRound: number): Player[] => {

  console.clear();

  printInformation(generateBoard(players));

  if (playerNumber === 0 && numberRound === 14)
    return getWinner(players);

  printInformation(midGameScreenInformation(numberRound, players[playerNumber]));

  const newPlayerState: Player = turn(players[playerNumber], 1, []);

  const newPlayers: Player[] = players;
  newPlayers[playerNumber] = newPlayerState;

  const next: number = whosNext(playerNumber, players.length);

  return midGame(newPlayers, next, nextRound(next, numberRound));
}

//this function will manage the structure of the game itself
//referring to any possible and needed state of the game
const game = (): void => {

  printInformation('Welcome to Yahtzee Game!');

  const players: Player[] = startGame();

  //return the winner(s) or null if there's a total draw
  const winner: Player[] = midGame(players, 0, 1);

  announceWinner(winner);

}


//------------------------

//USER INTERFACE & INTERACTION 

//------------------------

//gives back the information during the beginnning of the turn
const midGameScreenInformation = (numberRound: number, player: Player): string => {

  let result = "Turn Number #" + numberRound + "\n";

  result += colorString(player.color, "It's your turn, color " + getColor(player.color));

  return result;

}

//from the string code it gives the name of the color
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

//it announces the winner
const announceWinner = (players: Player[]): void => {

  printInformation("The game is finished.")

  if (players.length === 1)
    printInformation(`...and the winner is...
    ... ` + colorString(players[0].color,
      `COLOR ${getColor(players[0].color)}! Congratulations!`));
  else
    printInformation(`...ugh... it seems there's a draw!
So the winners are...
    ... COLOR ${players.reduce((sum: string, p: Player): string => sum = sum + (sum !== '' ? ", " : '') + colorString(p.color, getColor(p.color)), '')}! Congratulations!`);
}

//it prints on the screen
const printInformation = (information: string) => {
  console.log(information);
}

//return a specified number of characters in just one string
const putChar = (num: number, char: string): string => {

  let result: string = "";

  for (let i = 0; i < num; i++)
    result += char;

  return result;
}

//given a string and a number, it returns that string inside the number of blank spaces specified. Considering that one is put in front of the string and the rest after
const fillChar = (num: number, name: string): string => {

  let result: string = name;

  if (name.length < num) {
    result = " " + result;
    if (name.length < num - 1)
      result = result + putChar(num - result.length, " ")
  }

  return result;
}

//it colors a string of the color specified
const colorString = (color: string, content: string): string => `${color}${content}${Reset}`;

//it makes the array of dice as a good looking string
const prettyStringDice = (dice: Die[]): string => {
  let diceString: string = "";

  for (let i = 0; i < dice.length; i++) {
    diceString += `${BgWhite} ${dice[i]} ${Reset}   `
  }

  return diceString;
}

//it generates the row to be printed
const generateRow = (players: Player[], n_row: number, N_CHAR_COL1: number, N_CHAR_COL2: number): string => {

  let row = "";

  for (let j = 0; j < players.length + 1; j++) {

    const indexCol = j - 1; //because the first col doesnt refer to any player
    const indexRow = n_row - 1;

    if (indexCol < 0)
      if (indexRow < 0)
        row += putChar(N_CHAR_COL1, ' ');
      else
        if (indexRow < players[0].score.length)
          row += fillChar(N_CHAR_COL1, players[0].score[indexRow].name);
        else
          row += fillChar(N_CHAR_COL1, "TOTAL SCORE");
    else
      if (indexRow < 0)
        row += colorString(players[indexCol].color, fillChar(N_CHAR_COL2, getColor(players[indexCol].color)));
      else
        if (indexRow < players[0].score.length) {

          const numDisplay: string = players[indexCol].score[indexRow].value.toString();

          row += !players[indexCol].score[indexRow].used ? fillChar(N_CHAR_COL2, numDisplay) : colorString(BgWhite, fillChar(N_CHAR_COL2, numDisplay));
        } else
          row += fillChar(N_CHAR_COL2,
            getTotalScore(players[indexCol]).toString());

    row += "|";

  }

  return row;

}

//it prints the board of the game
const generateBoard = (players: Player[]): string => {

  const N_CHAR_COL1: number = 18; //represent the char space of the first column part
  const N_CHAR_COL2: number = 9; //represent the char space from the second column on

  const separator: string = putChar(N_CHAR_COL1 + (N_CHAR_COL2 + 1) * players.length, "-");

  let result: string = "\n";

  for (let i = 0; i < players[0].score.length + 2; i++) {

    if (i === 1 || i === players[0].score.length + 1)
      result += separator + "\n";

    result += generateRow(players, i, N_CHAR_COL1, N_CHAR_COL2) + "\n";

  }

  result += "\n\n";

  return result;
}


//game call

game();


