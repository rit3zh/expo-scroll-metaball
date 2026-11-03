import type { TSkeletonSong, TSkeletonTile } from "@/constants/interface";
import type { StatusBarAnimation } from "expo-status-bar";
import type { WithSpringConfig } from "react-native-reanimated";

const BANNER_CALM_FADE_MS: number = 180;
const BANNER_LOCK_PULL: number = 70;
const BANNER_REST_EPSILON: number = 0.5;
const BANNER_SETTLE_EXPAND: number = 0.02;
const BANNER_SPRING: WithSpringConfig = {
  damping: 30,
  mass: 1,
  stiffness: 260,
};
const BANNER_STATUS_BAR_ANIMATION: StatusBarAnimation = "fade";
const BANNER_UNLOCK_OFFSET = 1;
const HEADER_BAR_HEIGHT: number = 160;
const HEADER_BLUR_INTENSITY: number = 10;
const HEADER_BLUR_START_OFFSET: number = 0.12;
const HEADER_FADE_RANGE: number[] = [0.55, 1];
const SKELETON_GUTTER: number = 20;
const SKELETON_SHELF_GAP: number = 12;
const SKELETON_SONG_COUNT: number = 5;
const SKELETON_SONGS_TITLE_WIDTH: number = 112;
const SKELETON_SUBTITLE_WIDTHS = ["34%", "26%", "40%", "30%", "22%"];
const SKELETON_TILE_SUBTITLE_WIDTHS = ["36%", "28%", "44%"];
const SKELETON_TILE_TITLE_WIDTHS = ["78%", "62%", "70%", "54%"];
const SKELETON_TITLE_WIDTHS = ["58%", "44%", "66%", "50%", "38%", "62%"];
const SKELETON_SONGS = Array.from(
  { length: SKELETON_SONG_COUNT },
  (_: unknown, index: number): TSkeletonSong => ({
    id: index,
    subtitleWidth:
      SKELETON_SUBTITLE_WIDTHS[index % SKELETON_SUBTITLE_WIDTHS.length],
    titleWidth: SKELETON_TITLE_WIDTHS[index % SKELETON_TITLE_WIDTHS.length],
  }),
);
const SKELETON_TILE_COUNT: number = 6;
const SKELETON_VIDEO_TILE_COUNT: number = 4;
const SKELETON_TILES = Array.from(
  { length: SKELETON_TILE_COUNT },
  (_: unknown, index: number): TSkeletonTile => ({
    id: index,
    subtitleWidth:
      SKELETON_TILE_SUBTITLE_WIDTHS[
        index % SKELETON_TILE_SUBTITLE_WIDTHS.length
      ],
    titleWidth:
      SKELETON_TILE_TITLE_WIDTHS[index % SKELETON_TILE_TITLE_WIDTHS.length],
  }),
);
const SKELETON_SHELVES = [
  {
    id: "albums",
    tileHeight: 220,
    tiles: SKELETON_TILES,
    tileWidth: 220,
    titleWidth: 84,
  },
  {
    id: "videos",
    tileHeight: 169,
    tiles: SKELETON_TILES.slice(0, SKELETON_VIDEO_TILE_COUNT),
    tileWidth: 300,
    titleWidth: 124,
  },
];

export {
  BANNER_CALM_FADE_MS,
  BANNER_LOCK_PULL,
  BANNER_REST_EPSILON,
  BANNER_SETTLE_EXPAND,
  BANNER_SPRING,
  BANNER_STATUS_BAR_ANIMATION,
  BANNER_UNLOCK_OFFSET,
  HEADER_BAR_HEIGHT,
  HEADER_BLUR_INTENSITY,
  HEADER_BLUR_START_OFFSET,
  HEADER_FADE_RANGE,
  SKELETON_GUTTER,
  SKELETON_SHELF_GAP,
  SKELETON_SHELVES,
  SKELETON_SONG_COUNT,
  SKELETON_SONGS,
  SKELETON_SONGS_TITLE_WIDTH,
  SKELETON_SUBTITLE_WIDTHS,
  SKELETON_TILE_COUNT,
  SKELETON_TILE_SUBTITLE_WIDTHS,
  SKELETON_TILE_TITLE_WIDTHS,
  SKELETON_TILES,
  SKELETON_TITLE_WIDTHS,
  SKELETON_VIDEO_TILE_COUNT,
};
