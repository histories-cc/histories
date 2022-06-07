import strip from 'strip-comments';

function OptimizeString(str: string): string {
  // credit to this amazing person from stack owerflow
  // https://stackoverflow.com/a/1981837

  const optimized = strip(str) // remove all comments
    .replace(/\n/g, ' ') // replace new line with space
    .replace(/  +/g, ' '); // remove all unnecessary spaces

  return optimized;
}

export default OptimizeString;
