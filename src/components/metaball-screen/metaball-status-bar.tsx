import { BANNER_STATUS_BAR_ANIMATION } from "@/constants/components/metaball-screen.const";
import { useWorkletState } from "@/hooks/use-worklet-state";
import { registerComponent } from "@/utils/register-component.util";
import { Stack } from "expo-router";
import type { FC } from "react";
import type { IMetaballStatusBar } from "./interface";

const MetaballStatusBarBase: FC<IMetaballStatusBar> = ({
  isLocked,
}: IMetaballStatusBar &
  React.ComponentProps<typeof MetaballStatusBarBase>): React.ReactNode &
  React.JSX.Element => {
  const isHidden: boolean = useWorkletState(() => {
    "worklet";
    return isLocked.get();
  });

  return (
    <Stack.Screen
      options={{
        headerShown: false,
        statusBarAnimation: BANNER_STATUS_BAR_ANIMATION,
        statusBarHidden: isHidden,
      }}
    />
  );
};

const MetaballStatusBar = registerComponent(
  "MetaballStatusBar",
  MetaballStatusBarBase,
);

export { MetaballStatusBar };
