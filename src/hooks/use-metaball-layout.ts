import {
  AVATAR_SIZE,
  AVATAR_TOP_GAP,
  BANNER_HEIGHT_RATIO,
  CONTENT_GAP,
} from "@/constants/layout.const";
import { resolveIslandFrame } from "@/utils/resolve-island-frame.util";
import { useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { TIslandFrame, TMetaballLayout } from "./interface";

const useMetaballLayout = (): TMetaballLayout => {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  return useMemo<TMetaballLayout>(() => {
    const island: TIslandFrame = resolveIslandFrame(top, width);
    const avatarRadius: number = AVATAR_SIZE / 2;
    const avatarTop = top + AVATAR_TOP_GAP;
    const avatarCenterY = avatarTop + avatarRadius;
    const avatarCollapse: number = avatarCenterY - island.centerY;
    const contentInset = avatarTop + AVATAR_SIZE + CONTENT_GAP;
    const bannerExtra: number = Math.max(
      0,
      width * BANNER_HEIGHT_RATIO + CONTENT_GAP - contentInset,
    );

    return {
      avatarCenterY,
      avatarCollapse,
      avatarRadius,
      bannerExtra,
      canvasHeight: height,
      contentInset,
      island,
      minContentHeight: height + avatarCollapse,
      pixel: 1 / PixelRatio.get(),
      screenWidth: width,
      snapOffsets: [0, avatarCollapse],
    };
  }, [height, top, width]);
};

export { useMetaballLayout };
