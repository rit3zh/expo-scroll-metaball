import type { TSkeletonShelf, TSkeletonSong } from "@/constants/interface";
import type { TMetaballLayout } from "@/hooks/interface";
import type Animated from "react-native-reanimated";
import type {
  AnimatedRef,
  ScrollHandlerProcessed,
  SharedValue,
} from "react-native-reanimated";

interface IMetaballHeader {
  layout: TMetaballLayout;
  scrollY: SharedValue<number>;
}

interface IMetaballStatusBar {
  isLocked: SharedValue<boolean>;
}

interface ISkeletonSectionTitle {
  width: number;
}

interface ISkeletonShelf {
  shelf: TSkeletonShelf;
}

interface ISkeletonSongRow {
  song: TSkeletonSong;
}

type TMetaballScroll = {
  anchor: SharedValue<number>;
  calm: SharedValue<number>;
  expand: SharedValue<number>;
  isLocked: SharedValue<boolean>;
  onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
  scrollRef: AnimatedRef<Animated.ScrollView>;
  scrollY: SharedValue<number>;
};

export {
  type IMetaballHeader,
  type IMetaballStatusBar,
  type ISkeletonSectionTitle,
  type ISkeletonShelf,
  type ISkeletonSongRow,
  type TMetaballScroll,
};
