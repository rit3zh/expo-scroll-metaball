import {
  BANNER_CALM_FADE_MS,
  BANNER_LOCK_PULL,
  BANNER_REST_EPSILON,
  BANNER_SETTLE_EXPAND,
  BANNER_SPRING,
  BANNER_UNLOCK_OFFSET,
} from "@/constants/components/metaball-screen.const";
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
  withTiming,
  type ScrollEvent,
} from "react-native-reanimated";
import type { TMetaballScroll } from "../interface";

const useMetaballScroll = (): TMetaballScroll => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue<number>(0);
  const expand = useSharedValue<number>(0);
  const anchor = useSharedValue<number>(0);
  const calm = useSharedValue<number>(0);
  const isDragging = useSharedValue<boolean>(false);
  const isHolding = useSharedValue<boolean>(false);
  const isLocked = useSharedValue<boolean>(false);

  useAnimatedReaction(
    () =>
      isHolding.get() &&
      expand.get() < BANNER_SETTLE_EXPAND &&
      calm.get() === 0,
    (isSettled) => {
      if (!isSettled) {
        return;
      }

      isHolding.set(false);
      anchor.set(withSpring(0, BANNER_SPRING));
    },
  );

  const onScroll = useAnimatedScrollHandler<Record<string, unknown>>({
    onBeginDrag: () => {
      isDragging.set(true);

      if (calm.get() > 0) {
        calm.set(withTiming(0, { duration: BANNER_CALM_FADE_MS }));
      }
    },
    onEndDrag: (event: ScrollEvent) => {
      isDragging.set(false);

      if (isHolding.get() && event.contentOffset.y > BANNER_REST_EPSILON) {
        calm.set(1);
        requestAnimationFrame(() => {
          scrollTo(scrollRef, 0, 0, true);
        });
      }
    },
    onMomentumEnd: (event: ScrollEvent) => {
      if (calm.get() > 0 && event.contentOffset.y > BANNER_REST_EPSILON) {
        scrollTo(scrollRef, 0, 0, true);
      }
    },
    onScroll: (event) => {
      const offset: number = event.contentOffset.y;

      scrollY.set(offset);

      if (!isLocked.get() && isDragging.get() && offset < -BANNER_LOCK_PULL) {
        isLocked.set(true);
        isHolding.set(false);
        anchor.set(0);
        calm.set(0);
        expand.set(withSpring(1, BANNER_SPRING));
      } else if (isLocked.get() && offset > BANNER_UNLOCK_OFFSET) {
        isLocked.set(false);
        isHolding.set(true);
        anchor.set(offset);
        expand.set(withSpring(0, BANNER_SPRING));

        if (!isDragging.get()) {
          calm.set(1);
          scrollTo(scrollRef, 0, 0, true);
        }
      } else if (!isLocked.get()) {
        if (isHolding.get()) {
          anchor.set(Math.max(offset, 0));
        }

        if (offset <= BANNER_REST_EPSILON) {
          if (anchor.get() > 0) {
            anchor.set(0);
          }

          if (calm.get() > 0 && !isDragging.get()) {
            calm.set(withTiming(0, { duration: BANNER_CALM_FADE_MS }));
          }
        }
      }
    },
  });

  return {
    anchor,
    calm,
    expand,
    isLocked,
    onScroll,
    scrollRef,
    scrollY,
  };
};

export { useMetaballScroll };
