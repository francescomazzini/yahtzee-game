var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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
    score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
  if (indexes.length !== 0)
    return [dice[index1], ...whichDieToKeep(indexes, dice)];
  return [];
};
const indexOfDie = () => {
  const answer = input("Which of the dice, would you like to keep? Write its number (1-5) or write 0 to stop choosing (if you don't want any, write immediately 0)");
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
      return indexOfDie();
    }
  }
};
const indexOfDice = (counter, indexes) => {
  if (counter > 5)
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
  const newDice = indexDiceKeep.length === 5 ? dice : whichDieToKeep(indexDiceKeep.map((i) => i - 1), dice);
  console.log("You kept the following dice: ");
  console.log(newDice);
  return newDice;
};
const turn = (currentPlayer, numberRound, dice) => {
  const tempDice = [...dice, ...rollDice(N_DIES - dice.length)];
  if (numberRound !== 3) {
    const keptDice = askDiceToKeep(tempDice);
  } else {
  }
  return { color: "asa", score: [0, 0] };
};
const midGame = (players, playerNumber) => {
  turn(players[playerNumber], 1, []);
  return null;
};
const game = () => {
  const players = startGame();
  const winner = midGame(players, 0);
};
game();
//# sourceMappingURL=index.js.map
