export interface Game {
  id: number;
  name: string;
  thumbnail?: string;
  image?: string;
  year: number;
  playingTime: number;
  minPlayers: number;
  maxPlayers: number;
  weight: number;
  BGGRating?: number;
  BGGRank?: number;
}
