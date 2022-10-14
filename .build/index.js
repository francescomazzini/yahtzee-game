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
const createPlayer = (numberNewPlayer) => {
  if (numberNewPlayer < 1)
    return [];
  return [...createPlayer(numberNewPlayer - 1), {
    color: `[4${numberNewPlayer + 1}m`,
    score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
  console.log(`Which of the dice, would you like to keep? Write the number of their position (1-5) or write 0 to stop choosing (if you don't want any, write immediately 0)`);
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
  console.log("The dice have been rolled");
  console.log("Their values are: ");
  console.log(dice);
  const indexDiceKeep = indexOfDice(1, []);
  const newDice = indexDiceKeep.length === N_DIES ? dice : whichDieToKeep(indexDiceKeep.map((i) => i - 1), dice);
  console.log("You kept the following dice: ");
  console.log(newDice);
  return newDice;
};
const transformCombination = () => {
  console.log(`Which of the combination, you'd like to assign your dice points?`);
  const answer = input();
  switch (answer) {
    case "Ones":
      return 0;
    case "Twos":
      return 1;
    case "Threes":
      return 2;
    case "Fours":
      return 3;
    case "Fives":
      return 4;
    case "Sixes":
      return 5;
    case "Three of a kind":
      return 6;
    case "Four of a kind":
      return 7;
    case "Full House":
      return 8;
    case "Small straight":
      return 9;
    case "Large straight":
      return 10;
    case "Chance":
      return 11;
    case "YAHTZEE":
      return 12;
    default: {
      console.log("Invalid choice, you must use the names of the combinations, displayed in the point table");
    }
  }
  return transformCombination();
};
const askCombination = (_a) => {
  var _b = _a, { score } = _b, player = __objRest(_b, ["score"]);
  const combinationChosen = transformCombination();
  if (score[combinationChosen] !== 0) {
    console.log("You can't assign the score to this combination because you already did in the past! Please choose another one");
    return askCombination(__spreadValues({ score }, player));
  }
  return combinationChosen;
};
const getScoreComputation = (combination) => {
  switch (combination) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return (dice) => dice.filter((d) => d === combination + 1).reduce((sum, d) => sum + d, 0);
    case 6:
    case 7:
    case 8: {
      const frequencyMap = (dice) => dice.map((die) => dice.reduce((sum, d1) => sum + d1 === die ? 1 : 0, 0));
      switch (combination) {
        case 6:
        case 7:
          return (dice) => {
            const isThereAtLeastN = frequencyMap(dice).some((n) => n >= combination - 3);
            return isThereAtLeastN ? dice.reduce((sum, d) => sum + d, 0) : 0;
          };
        case 8:
          return (dice) => {
            const isThere3 = frequencyMap(dice).some((n) => n === 3);
            const isThere2 = frequencyMap(dice).some((n) => n === 2);
            return isThere3 && isThere3 ? 25 : 0;
          };
      }
    }
    case 9:
      return (dice) => {
        const isSmallStr = dice.reduce((isIt, d, i, ds) => {
          if (i < ds.length && i > 0)
            isIt = isIt && d === ds[i + 1] - 1;
          else
            isIt = isIt && (ds[0] === ds[1] - 1 || ds[ds.length] === ds[ds.length - 1] + 1);
          return isIt;
        }, true);
        return isSmallStr ? 30 : 0;
      };
    case 10:
      return (dice) => {
        const isSmallStr = dice.reduce((isIt, d, i, ds) => {
          if (i < ds.length)
            isIt = isIt && d === ds[i + 1] - 1;
          else
            isIt = isIt && ds[ds.length] === ds[ds.length - 1] + 1;
          return isIt;
        }, true);
        return isSmallStr ? 30 : 0;
      };
    case 11:
      return (dice) => dice.reduce((sum, d) => sum + d, 0);
    case 12:
      return (dice) => {
        const frequencyMap = dice.map((die) => dice.reduce((sum, d1) => sum + d1 === die ? 1 : 0, 0));
        const isThere5 = frequencyMap.some((n) => n === 5);
        return isThere5 ? 50 : 0;
      };
  }
  return (dice) => 0;
};
const newPlayerScore = (converter, combination, _c, dice) => {
  var _d = _c, { score } = _d, player = __objRest(_d, ["score"]);
  const newScore = [...score];
  newScore[combination] = converter(dice);
  return __spreadValues({ score: newScore }, player);
};
const turn = (currentPlayer, numberRound, dice) => {
  const tempDice = [...dice, ...rollDice(N_DIES - dice.length)];
  if (numberRound !== 3) {
    const keptDice = askDiceToKeep(tempDice);
    if (keptDice.length === N_DIES)
      return turn(currentPlayer, 3, keptDice);
  } else {
    const combination = askCombination(currentPlayer);
    return newPlayerScore(getScoreComputation(combination), combination, currentPlayer, tempDice);
  }
  return __spreadValues({}, currentPlayer);
};
const getWinner = (players) => {
  const sortedByPoints = players.map((player) => ({
    player,
    total: player.score.reduce((sum, n) => sum = sum + n, 0)
  })).sort((p1, p2) => p2.total - p1.total);
  return sortedByPoints.filter(({ player, total }) => total === sortedByPoints[0].total).map(({ player, score }) => player);
};
const midGame = (players, playerNumber, numberRound) => {
  if (playerNumber === 0 && numberRound === 14)
    return getWinner(players);
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
    ...COLOR ${getColor(players[0].color)}. Congratulations!`);
  else
    console.log(`...ugh... it seems there's a draw!
    So the winners are...
    ... COLOR ${players.reduce((sum, p) => sum = sum + ", " + getColor(p.color), "")}. Congratulations!`);
};
const game = () => {
  const players = startGame();
  const winner = midGame(players, 0, 1);
  announceWinner(winner);
};
game();
//# sourceMappingURL=index.js.map
