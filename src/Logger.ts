import { createLogger, format, transports } from 'winston';

const errorFormat = format(info => {
  if (info && info instanceof Error) {
      info.message = info.stack || '';  // This includes the message.
  }
  return info;
});

const prefixFormat = format(info => {
  info.message = [
    new Date().toISOString(),
    info.level.padEnd(5, ' '),
    info.message || ''
  ]
    .filter(v => v)
    .join(' | ');

  return info;
});

const finalizeFormat = format(info => {
  // We need to define a formatter as a finalizer formatter - i.e. by setting
  // info[Symbol.for('message')] = info.message as info[Symbol.for('message')] is what's actually
  // printed, info.message is what's passed by the log call. If it isn't set, you'll just print
  // 'undefined'.
  info[Symbol.for('message')] = `${info.message}`;
  return info;
});

const logger = createLogger({
  format: format.combine(
    errorFormat(),
    prefixFormat(),
    finalizeFormat()    // This one *has* to come last!
  ),
  transports: [
    new transports.Console({
      // We only want to apply colorize to the console, not to the file transport
      format: format.colorize({ all: true })
    }),
    new transports.File({
      filename: 'combined.log',
      maxsize: 10_000_000,
      maxFiles: 7,
      tailable: true
    }),
  ]
});

if (process.env.NODE_ENV === 'production') {
  logger.remove(logger.transports.find(transport => transport.name === 'console'));
}

export default logger;