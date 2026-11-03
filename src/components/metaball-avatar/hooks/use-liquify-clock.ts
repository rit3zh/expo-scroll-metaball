import { METABALL_LIQUIFY_SPEED } from "@/constants/components/metaball-avatar.const";
import { useCallback } from "react";
import {
  useAnimatedReaction,
  useFrameCallback,
  useSharedValue,
  type DerivedValue,
  type FrameInfo,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const useLiquifyClock = (
  liquify: DerivedValue<number>,
): SharedValue<number> => {
  const time = useSharedValue<number>(0);

  const tick = useCallback(
    (frame: FrameInfo) => {
      "worklet";
      const elapsed: number = (frame.timeSincePreviousFrame ?? 0) / 1000;

      time.set(time.get() + elapsed * METABALL_LIQUIFY_SPEED);
    },
    [time],
  );

  const { setActive } = useFrameCallback(tick, false);

  useAnimatedReaction(
    () => liquify.get() > 0,
    (isFlowing: boolean, previous: boolean | null) => {
      if (isFlowing !== previous) {
        scheduleOnRN(setActive, isFlowing);
      }
    },
  );

  return time;
};

export { useLiquifyClock };
