import type { DimensionValue } from "react-native";

type TArtistMedia = {
  photoUrl: string | null;
  videoUrl: string | null;
};
type TScheme = "light" | "dark";
type TPalette = {
  background: string;
  bone: string;
  boneSoft: string;
  placeholder: string;
  surface: string;
};
type TSkeletonSong = {
  id: number;
  subtitleWidth: DimensionValue;
  titleWidth: DimensionValue;
};
type TSkeletonTile = {
  id: number;
  subtitleWidth: DimensionValue;
  titleWidth: DimensionValue;
};
type TSkeletonShelf = {
  id: string;
  tileHeight: number;
  tiles: readonly TSkeletonTile[];
  tileWidth: number;
  titleWidth: number;
};

export {
  type TArtistMedia,
  type TPalette,
  type TScheme,
  type TSkeletonShelf,
  type TSkeletonSong,
  type TSkeletonTile,
};
