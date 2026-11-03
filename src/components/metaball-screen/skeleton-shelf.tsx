import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import {
  SKELETON_GUTTER,
  SKELETON_SHELF_GAP,
} from "@/constants/components/metaball-screen.const";
import type { TSkeletonTile } from "@/constants/interface";
import { registerComponent } from "@/utils/register-component.util";
import type { ISkeletonShelf } from "./interface";
import { SkeletonSectionTitle } from "./skeleton-section-title";

const SkeletonShelfBase: FC<ISkeletonShelf> = ({
  shelf,
}: ISkeletonShelf &
  React.ComponentProps<typeof SkeletonShelfBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={styles.section}>
    <SkeletonSectionTitle width={shelf.titleWidth} />
    <ScrollView
      horizontal
      contentContainerStyle={styles.tiles}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      snapToInterval={shelf.tileWidth + SKELETON_SHELF_GAP}
      style={styles.shelf}
    >
      {shelf.tiles.map(
        (tile: TSkeletonTile): React.JSX.Element => (
          <View key={tile.id} style={[styles.tile, { width: shelf.tileWidth }]}>
            <Skeleton height={shelf.tileHeight} radius={14} width="100%" />
            <View style={styles.lines}>
              <Skeleton height={12} width={tile.titleWidth} />
              <Skeleton height={10} tone="soft" width={tile.subtitleWidth} />
            </View>
          </View>
        ),
      )}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  lines: {
    gap: 8,
  },
  section: {
    gap: 18,
  },
  shelf: {
    marginHorizontal: -SKELETON_GUTTER,
  },
  tile: {
    gap: 12,
  },
  tiles: {
    gap: SKELETON_SHELF_GAP,
    paddingHorizontal: SKELETON_GUTTER,
  },
});

const SkeletonShelf = registerComponent("SkeletonShelf", SkeletonShelfBase);

export { SkeletonShelf };
