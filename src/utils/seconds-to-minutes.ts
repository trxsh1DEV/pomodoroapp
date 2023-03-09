import { zeroLeft } from './zero-left';

export function secondsToMinutes(seconds: number): string {
  // Arredondando pra baixo e adicionando zero a esquerda qnd o número n tiver 2 casas decimais
  const min = zeroLeft((seconds / 60) % 60);
  const sec = zeroLeft(seconds % 60);
  return `${min}:${sec}`;
}
