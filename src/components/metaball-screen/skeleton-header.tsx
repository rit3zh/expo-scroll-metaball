import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { registerComponent } from "@/utils/register-component.util";

const SkeletonHeaderBase: FC = (): React.ReactNode & React.JSX.Element => (
  <View style={styles.header}>
    <Skeleton height={20} width={176} />
    <Skeleton height={12} tone="soft" width={92} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    gap: 12,
  },
});

const SkeletonHeader = registerComponent("SkeletonHeader", SkeletonHeaderBase);

export { SkeletonHeader };
