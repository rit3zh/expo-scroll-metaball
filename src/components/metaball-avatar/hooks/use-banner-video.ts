import {
  METABALL_VIDEO_EXPAND_RANGE,
  METABALL_VIDEO_FADE_MS,
} from "@/constants/components/metaball-avatar.const";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
  type DerivedValue,
  type SharedValue,
} from "react-native-reanimated";
import { loadVideo, type ImageLike, type TgfxVideo } from "react-native-tgfx";
import { scheduleOnRN } from "react-native-worklets";
import type { TBannerVideo } from "../interface";

const useBannerVideo = (
  url: string | null,
  isLocked: SharedValue<boolean>,
  expand: DerivedValue<number>,
): TBannerVideo => {
  const [frame, setFrame] = useState<ImageLike | null>(null);
  const videoRef = useRef<TgfxVideo | null>(null);
  const player = useSharedValue<TgfxVideo | null>(null);
  const posted = useSharedValue<number>(0);
  const ready = useSharedValue<number>(0);

  const onFrame = useCallback(
    (handle: number, width: number, height: number) => {
      setFrame({ handle, height, width });
      ready.set(withTiming(1, { duration: METABALL_VIDEO_FADE_MS }));
    },
    [ready],
  );

  const pump = useCallback(() => {
    "worklet";
    const video = player.get();

    if (video === null) {
      return;
    }
    const handle: number = video.updateFrame();
    if (handle !== 0 && posted.get() !== handle) {
      posted.set(handle);
      scheduleOnRN(onFrame, handle, video.width, video.height);
    }
  }, [onFrame, player, posted]);

  const { setActive: setPumping } = useFrameCallback(pump, false);

  const setPlaying = useCallback(
    (isPlaying: boolean) => {
      const video = videoRef.current;

      if (video === null) {
        setPumping(false);
        return;
      }
      video.paused = !isPlaying;
      setPumping(isPlaying);
    },
    [setPumping],
  );
  useAnimatedReaction(
    () => isLocked.get() || posted.get() === 0,
    (isPlaying: boolean, previous: boolean | null) => {
      if (isPlaying !== previous) {
        scheduleOnRN(setPlaying, isPlaying);
      }
    },
  );
  useEffect(() => {
    if (url === null) {
      return undefined;
    }

    let isActive: boolean = true;
    let opened: TgfxVideo | null = null;

    loadVideo(url)
      .then((video: TgfxVideo) => {
        if (!isActive) {
          video.release();
          return;
        }
        opened = video;
        videoRef.current = video;
        video.looping = true;
        video.volume = 0;
        player.set(video);
        setPlaying(isLocked.get() || posted.get() === 0);
      })
      .catch((error) => {
        if (isActive) {
          console.warn("Banner video failed to open:", error);
        }
      });

    return () => {
      isActive = false;
      videoRef.current = null;
      setPumping(false);
      player.set(null);
      posted.set(0);
      ready.set(0);
      setFrame(null);
      opened?.release();
    };
  }, [isLocked, player, posted, ready, setPlaying, setPumping, url]);

  const mix = useDerivedValue<number>(
    () =>
      interpolate(
        expand.get(),
        METABALL_VIDEO_EXPAND_RANGE,
        [0, 1],
        Extrapolation.CLAMP,
      ) * ready.get(),
  );

  return { frame, mix };
};

export { useBannerVideo };
