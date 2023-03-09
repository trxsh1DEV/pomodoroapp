import { zeroLeft } from './zero-left';

export function secondsToTime(seconds: number): string {
  // Arredondando pra baixo e adicionando zero a esquerda qnd o número n tiver 2 casas decimais
  const hours = zeroLeft(seconds / 3600);
  const min = zeroLeft((seconds / 60) % 60);
  const sec = zeroLeft(seconds % 60);
  return `${hours}:${min}:${sec}`;
}
