import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { registerComponent } from "@/utils/register-component.util";
import type { ISkeletonSongRow } from "./interface";

const SkeletonSongRowBase: FC<ISkeletonSongRow> = ({
  song,
}: ISkeletonSongRow &
  React.ComponentProps<typeof SkeletonSongRowBase>): React.ReactNode &
  React.JSX.Element => (
  <View style={styles.row}>
    <Skeleton height={52} radius={10} width={52} />
    <View style={styles.lines}>
      <Skeleton height={12} width={song.titleWidth} />
      <Skeleton height={10} tone="soft" width={song.subtitleWidth} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  lines: {
    flex: 1,
    gap: 9,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },
});

const SkeletonSongRow = registerComponent(
  "SkeletonSongRow",
  SkeletonSongRowBase,
);

export { SkeletonSongRow };
