export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function parseToken(token: string) {
  if (token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      // ignore
    }
  }
  return null;
}
