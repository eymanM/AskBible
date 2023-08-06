export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeEachFirst(str: string): string {
  const words = str.split(' ');

  return words.map((word) => {
    return word[0].toUpperCase() + word.substring(1);
  }).join(' ');
}

