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
const createPlayer = (players, numberNewPlayer) => {
  if (numberNewPlayer < 1)
    return players;
  return [...createPlayer(players, numberNewPlayer - 1), {
    color: `[4${numberNewPlayer + 1}m`,
    score: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }];
};
const startGame = () => {
  console.log("Welcome to Yahtzee Game!");
  const numberOfPlayers = getNumberOfPlayer();
  return createPlayer([], numberOfPlayers);
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
const game = () => {
  const players = startGame();
  console.log(players);
};
game();
//# sourceMappingURL=index.js.map
