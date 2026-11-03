import {
  HEADER_BAR_HEIGHT,
  HEADER_BLUR_INTENSITY,
  HEADER_BLUR_START_OFFSET,
  HEADER_FADE_RANGE,
} from "@/constants/components/metaball-screen.const";
import { registerComponent } from "@/utils/register-component.util";
import { ProgressiveBlurView } from "expo-backdrop";
import type { FC } from "react";
import { StyleSheet, useColorScheme, type ViewStyle } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { IMetaballHeader } from "./interface";

const MetaballHeaderBase: FC<IMetaballHeader> = ({
  layout,
  scrollY,
}: IMetaballHeader &
  React.ComponentProps<typeof MetaballHeaderBase>): React.ReactNode &
  React.JSX.Element => {
  const { top } = useSafeAreaInsets();
  const isDark: boolean = useColorScheme() === "dark";
  const fadeStart = layout.avatarCollapse * HEADER_FADE_RANGE[0];
  const fadeEnd = layout.avatarCollapse * HEADER_FADE_RANGE[1];

  const headerStyle = useAnimatedStyle<Pick<ViewStyle, "opacity">>(() => ({
    opacity: interpolate(
      scrollY.get(),
      [fadeStart, fadeEnd],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[styles.header, { height: top + HEADER_BAR_HEIGHT }, headerStyle]}
    >
      <ProgressiveBlurView
        edge="top"
        intensity={HEADER_BLUR_INTENSITY}
        startOffset={HEADER_BLUR_START_OFFSET}
        style={styles.blur}
        tint={
          isDark ? "systemUltraThinMaterialDark" : "systemUltraThinMaterial"
        }
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blur: {
    flex: 1,
  },
  header: {
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

const MetaballHeader = registerComponent("MetaballHeader", MetaballHeaderBase);

export { MetaballHeader };
