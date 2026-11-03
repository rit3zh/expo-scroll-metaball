import { MetaballAvatar } from "@/components/metaball-avatar";
import {
  SKELETON_GUTTER,
  SKELETON_SHELVES,
} from "@/constants/components/metaball-screen.const";
import type { TSkeletonShelf } from "@/constants/interface";
import { useMetaballLayout } from "@/hooks/use-metaball-layout";
import { usePalette } from "@/hooks/use-palette";
import { registerComponent } from "@/utils/register-component.util";
import type { FC } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMetaballScroll } from "./hooks/use-metaball-scroll";
import { MetaballHeader } from "./metaball-header";
import { MetaballStatusBar } from "./metaball-status-bar";
import { SkeletonHeader } from "./skeleton-header";
import { SkeletonShelf } from "./skeleton-shelf";
import { SkeletonTopSongs } from "./skeleton-top-songs";

const MetaballScreenBase: FC = (): React.ReactNode & React.JSX.Element => {
  const palette = usePalette();
  const layout = useMetaballLayout();
  const { bottom } = useSafeAreaInsets();
  const { anchor, calm, expand, isLocked, onScroll, scrollRef, scrollY } =
    useMetaballScroll();

  const rowsStyle = useAnimatedStyle<Pick<ViewStyle, "transform">>(() => ({
    transform: [{ translateY: layout.bannerExtra * expand.get() }],
  }));

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <MetaballStatusBar isLocked={isLocked} />
      <Animated.ScrollView
        contentContainerStyle={[
          styles.content,
          {
            minHeight: layout.minContentHeight,
            paddingBottom: bottom + 32,
            paddingTop: layout.contentInset,
          },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        ref={scrollRef}
        scrollEventThrottle={16}
        snapToEnd={false}
        snapToOffsets={layout.snapOffsets}
      >
        <Animated.View style={[styles.sections, rowsStyle]}>
          <SkeletonHeader />
          <SkeletonTopSongs />
          {SKELETON_SHELVES.map(
            (shelf: TSkeletonShelf): React.JSX.Element => (
              <SkeletonShelf key={shelf.id} shelf={shelf} />
            ),
          )}
        </Animated.View>
      </Animated.ScrollView>
      <MetaballHeader layout={layout} scrollY={scrollY} />
      <MetaballAvatar
        anchor={anchor}
        calm={calm}
        expand={expand}
        isLocked={isLocked}
        layout={layout}
        scrollY={scrollY}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SKELETON_GUTTER,
  },
  sections: {
    gap: 36,
  },
  screen: {
    flex: 1,
  },
});

const MetaballScreen = registerComponent("MetaballScreen", MetaballScreenBase);

export { MetaballScreen };
