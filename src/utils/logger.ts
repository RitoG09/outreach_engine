import winston from "winston";
import chalk from "chalk";

export const logSection = (title: string) => {
  console.log("\n" + chalk.cyan.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

  console.log(chalk.cyan.bold(`${title}`));

  console.log(chalk.cyan.bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
};

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  let coloredLevel: string;
  switch (level) {
    case "error":
      coloredLevel = chalk.bold.red("ERROR");
      break;

    case "warn":
      coloredLevel = chalk.bold.yellow("WARN");
      break;

    case "info":
      coloredLevel = chalk.bold.blue("INFO");
      break;

    case "success":
      coloredLevel = chalk.bold.green("SUCCESS");
      break;

    case "debug":
      coloredLevel = chalk.bold.magenta("DEBUG");
      break;

    default:
      coloredLevel = level;
  }

  return `${chalk.gray(timestamp)}${coloredLevel}${message}`;
});

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  success: 3,
  debug: 4,
};

export const logger = winston.createLogger({
  levels: customLevels,
  level: "debug",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    customFormat,
  ),

  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
}) as winston.Logger &
  Record<keyof typeof customLevels, winston.LeveledLogMethod>;
