var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var import_prompt_sync = __toModule(require("prompt-sync"));
const input = (0, import_prompt_sync.default)();
const Reset = "[0m";
const BgRed = "[41m";
const BgGreen = "[42m";
const BgYellow = "[43m";
const BgBlue = "[44m";
const BgMagenta = "[45m";
const BgCyan = "[46m";
const BgWhite = "[47m";
const N_DIES = 5;
const getNameScore = () => [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
  "Three of a kind",
  "Four of a kind",
  "Full house",
  "Small straight",
  "Large straight",
  "Chance",
  "YAHTZEE"
];
const setUpScore = () => {
  const names = getNameScore();
  const score = [];
  for (let i = 0; i < names.length; i++) {
    score.push({
      name: names[i],
      value: 0,
      used: false,
      position: i
    });
  }
  return score;
};
const createPlayer = (numberNewPlayer) => {
  if (numberNewPlayer < 1)
    return [];
  return [...createPlayer(numberNewPlayer - 1), {
    color: `[4${numberNewPlayer + 1}m`,
    score: setUpScore()
  }];
};
const startGame = () => {
  console.log("Welcome to Yahtzee Game!");
  const numberOfPlayers = getNumberOfPlayer();
  return createPlayer(numberOfPlayers);
};
const getNumberOfPlayer = () => {
  const answer = input(`How many people are going to play? (1-4) `);
  switch (answer) {
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    default: {
      console.log("Invalid number, please choose a number of players(1-4) ");
      return getNumberOfPlayer();
    }
  }
};
const rollDice = (numberDice) => {
  if (numberDice < 1)
    return [];
  else
    return [Math.trunc(Math.random() * 6) + 1, ...rollDice(numberDice - 1)];
};
const whichDieToKeep = ([index1, ...indexes], dice) => {
  if (index1 !== void 0)
    return [dice[index1], ...whichDieToKeep(indexes, dice)];
  return [];
};
const indexOfDie = () => {
  const answer = input();
  switch (answer) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    default: {
      console.log("Invalid number, please choose a number between 1-5 or 0 ");
    }
  }
  return indexOfDie();
};
const indexOfDice = (counter, indexes) => {
  if (counter > N_DIES)
    return [];
  const index = indexOfDie();
  if (index !== 0) {
    if (indexes.some((i) => i === index)) {
      console.log("You can't choose the same die twice");
      return [...indexOfDice(counter, indexes)];
    } else
      return [index, ...indexOfDice(counter + 1, [index, ...indexes])];
  }
  return [];
};
const askDiceToKeep = (dice) => {
  console.log("Choose the dice to keep writing their position (1-5) or (0) when you have finished");
  const indexDiceKeep = indexOfDice(1, []);
  const newDice = indexDiceKeep.length === N_DIES ? dice : whichDieToKeep(indexDiceKeep.map((i) => i - 1), dice);
  console.log("You kept the following dice: ");
  console.log(newDice);
  console.log();
  return newDice;
};
const askCombination = (player) => {
  console.log(`Which of the combination, you'd like to assign your dice points?`);
  const answer = input();
  const combination = player.score.find((s) => s.name === answer);
  if (combination === void 0) {
    console.log("Invalid choice, you must use the names of the combinations, displayed in the point table");
    return askCombination(player);
  }
  if (combination.used === true) {
    console.log("You can't assign the score to this combination because you already did in the past! Please choose another one");
    return askCombination(player);
  }
  return combination.position;
};
const getScoreComputation = (combination) => {
  const sumDice = (dice) => dice.reduce((sum, d) => sum + d, 0);
  switch (combination) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return (dice) => sumDice(dice.filter((d) => d === combination + 1));
    case 6:
    case 7:
    case 8:
    case 12: {
      const frequencyMap = (dice) => dice.map((die) => dice.reduce((sum, d1) => sum + (die === d1 ? 1 : 0), 0));
      const isThere = (frequencyMap2, condition, dice) => frequencyMap2(dice).some((n) => condition(n));
      switch (combination) {
        case 6:
        case 7:
          return (dice) => isThere(frequencyMap, (n) => n >= combination - 3, dice) ? sumDice(dice) : 0;
        case 8:
          return (dice) => isThere(frequencyMap, (n) => n === 3, dice) && isThere(frequencyMap, (n) => n === 2, dice) ? 25 : 0;
        case 12:
          return (dice) => isThere(frequencyMap, (n) => n === 5, dice) ? 50 : 0;
      }
    }
    case 9:
    case 10: {
      const sortedDice = (dice) => [...dice].sort((a, b) => a - b);
      const isStraight = (dice, conditionIndex, conditionEdgeCase) => {
        return dice.reduce((isIt, d, i, ds) => {
          if (i < ds.length - 2 && conditionIndex(i))
            isIt = isIt && d === ds[i + 1] - 1;
          else
            isIt = isIt && (conditionEdgeCase(ds) || ds[ds.length - 1] === ds[ds.length - 2] + 1);
          return isIt && ds.length >= 4;
        }, true);
      };
      switch (combination) {
        case 9:
          return (dice) => isStraight([...new Set(sortedDice(dice))], (i) => i > 0, (ds) => ds[0] === ds[1] - 1) ? 30 : 0;
        case 10:
          return (dice) => isStraight(sortedDice(dice), (i) => true, (ds) => false) ? 40 : 0;
      }
    }
    case 11:
      return (dice) => sumDice(dice);
  }
  return (dice) => 0;
};
const newPlayerScore = (converter, combination, _a, dice) => {
  var _b = _a, { score } = _b, player = __objRest(_b, ["score"]);
  const beforeScore = score.slice(0, combination);
  const afterScore = score.slice(combination + 1, score.length);
  const currentScore = score[combination];
  return __spreadValues({ score: [...beforeScore, { value: converter(dice), used: true, name: currentScore.name, position: currentScore.position }, ...afterScore] }, player);
};
const turn = (currentPlayer, numberRound, dice) => {
  const tempDice = [...dice, ...rollDice(N_DIES - dice.length)];
  if (dice.length != 5) {
    console.log("The dice have been rolled");
    console.log("Their values are: ");
    console.log(tempDice);
  }
  if (numberRound !== 3) {
    const keptDice = askDiceToKeep(tempDice);
    if (keptDice.length === N_DIES)
      return turn(currentPlayer, 3, keptDice);
    return turn(currentPlayer, numberRound + 1, keptDice);
  } else {
    const combination = askCombination(currentPlayer);
    return newPlayerScore(getScoreComputation(combination), combination, currentPlayer, tempDice);
  }
  return __spreadValues({}, currentPlayer);
};
const getTotalScore = (player) => player.score.reduce((sum, n) => sum = sum + n.value, 0);
const getWinner = (players) => {
  const sortedByPoints = players.map((player) => ({
    player,
    total: getTotalScore(player)
  })).sort((p1, p2) => p2.total - p1.total);
  return sortedByPoints.filter(({ player, total }) => total === sortedByPoints[0].total).map(({ player, total }) => player);
};
const putChar = (num, char) => {
  let result = "";
  for (let i = 0; i < num; i++)
    result += char;
  return result;
};
const fillChar = (num, name) => {
  let result = name;
  if (name.length < num) {
    result = " " + result;
    if (name.length < num - 1)
      result = result + putChar(num - result.length, " ");
  }
  return result;
};
const colorString = (color, content) => `${color}${content}${Reset}`;
const printBoard = (players) => {
  const N_CHAR_COL1 = 18;
  const N_CHAR_COL2 = 9;
  const separator = putChar(N_CHAR_COL1 + (N_CHAR_COL2 + 1) * players.length, "-");
  console.clear();
  console.log();
  for (let i = 0; i < players[0].score.length + 2; i++) {
    if (i === 1 || i === players[0].score.length + 1)
      console.log(separator);
    let row = "";
    for (let j = 0; j < players.length + 1; j++) {
      const indexCol = j - 1;
      const indexRow = i - 1;
      if (indexCol < 0)
        if (indexRow < 0)
          row += putChar(N_CHAR_COL1, " ");
        else if (indexRow < players[0].score.length)
          row += fillChar(N_CHAR_COL1, players[0].score[indexRow].name);
        else
          row += fillChar(N_CHAR_COL1, "TOTAL SCORE");
      else if (indexRow < 0)
        row += colorString(players[indexCol].color, fillChar(N_CHAR_COL2, getColor(players[indexCol].color)));
      else if (indexRow < players[0].score.length)
        row += fillChar(N_CHAR_COL2, players[indexCol].score[indexRow].value.toString());
      else
        row += fillChar(N_CHAR_COL2, getTotalScore(players[indexCol]).toString());
      row += "|";
    }
    console.log(row);
  }
  console.log();
  console.log();
};
const midGame = (players, playerNumber, numberRound) => {
  printBoard(players);
  if (playerNumber === 0 && numberRound === 14)
    return getWinner(players);
  if (playerNumber === 0)
    console.log("Turn Number #" + numberRound);
  console.log("It's your turn, color " + getColor(players[playerNumber].color));
  const newPlayerState = turn(players[playerNumber], 1, []);
  const newPlayers = players;
  newPlayers[playerNumber] = newPlayerState;
  const next = (playerNumber + 1) % players.length;
  return midGame(newPlayers, next, next === 0 ? numberRound + 1 : numberRound);
};
const getColor = (color) => {
  switch (color) {
    case "[42m":
      return "GREEN";
    case "[43m":
      return "YELLOW";
    case "[44m":
      return "BLUE";
    case "[45m":
      return "MAGENTA";
  }
  return "????";
};
const announceWinner = (players) => {
  console.log("The game is finished.");
  if (players.length === 1)
    console.log(`...and the winner is...
    ...COLOR ${getColor(players[0].color)}! Congratulations!`);
  else
    console.log(`...ugh... it seems there's a draw!
So the winners are...
    ... COLOR ${players.reduce((sum, p) => sum = sum + (sum !== "" ? ", " : "") + getColor(p.color), "")}! Congratulations!`);
};
const game = () => {
  const players = startGame();
  const winner = midGame(players, 0, 1);
  announceWinner(winner);
};
game();
//# sourceMappingURL=index.js.map
