export function capitalizeFirstLetter(string: string) {
    return string.replace(/\b[a-z]/g, (char) => char.toUpperCase());
  }