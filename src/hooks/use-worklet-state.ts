import { useState } from "react";
import { useAnimatedReaction } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const useWorkletState = (prepare: () => boolean): boolean => {
  const [state, setState] = useState<boolean>(false);

  useAnimatedReaction(prepare, (next: boolean, previous: boolean | null) => {
    if (next !== previous) {
      scheduleOnRN(setState, next);
    }
  });

  return state;
};

export { useWorkletState };
