import winston from "winston";
import { env } from "./env";

const { combine, timestamp, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: env.NODE_ENV === "development" ? "debug" : "info",
  format: combine(
    colorize(),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.Console()
  ],
});
