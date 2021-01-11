import log from 'loglevel';

// setup loglevel
if (process.env.NODE_ENV === "production") {
  log.setLevel('ERROR', false);
} else {
  log.setLevel('TRACE', false);
}

export default log;