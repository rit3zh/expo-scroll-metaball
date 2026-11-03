import {
  METABALL_BLEND_RANGE,
  METABALL_BLUR_MAX,
  METABALL_BLUR_RANGE,
  METABALL_DARKEN_RANGE,
  METABALL_DROP_REACH_RANGE,
  METABALL_DROP_TIP_RATIO,
  METABALL_GOO_FADE,
  METABALL_GOO_MAX,
  METABALL_GOO_MIN,
  METABALL_GOO_RAMP,
  METABALL_LIQUIFY_EXPAND_RANGE,
  METABALL_PRESENCE_SCALES,
  METABALL_PRESENCE_STOPS,
  METABALL_RADIUS_END_RATIO,
  METABALL_RADIUS_MID_RATIO,
} from "@/constants/components/metaball-avatar.const";
import { PULL_DISTANCE, PULL_SCALE } from "@/constants/layout.const";
import type { TMetaballLayout } from "@/hooks/interface";
import { useMemo } from "react";
import {
  clamp,
  Extrapolation,
  interpolate,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";
import type { TMetaballMotion } from "../interface";
import { useLiquifyClock } from "./use-liquify-clock";

const useMetaballMotion = (
  scrollY: SharedValue<number>,
  progress: SharedValue<number>,
  anchor: SharedValue<number>,
  calm: SharedValue<number>,
  layout: TMetaballLayout,
): TMetaballMotion => {
  const collapse = layout.avatarCollapse;
  const restCenterY = layout.avatarCenterY;
  const restRadius = layout.avatarRadius;
  const bannerExtra = layout.bannerExtra;
  const islandCenterY = layout.island.centerY;
  const islandBottom = islandCenterY + layout.island.halfHeight;
  const isHardware: boolean = layout.island.isHardware;
  const endRadius = layout.island.halfHeight * METABALL_RADIUS_END_RATIO;
  const blendStart = collapse * METABALL_BLEND_RANGE[0];
  const blendEnd = collapse * METABALL_BLEND_RANGE[1];
  const blurStart = collapse * METABALL_BLUR_RANGE[0];
  const blurEnd = collapse * METABALL_BLUR_RANGE[1];
  const darkenStart = collapse * METABALL_DARKEN_RANGE[0];
  const darkenEnd = collapse * METABALL_DARKEN_RANGE[1];
  const reachStart = collapse * METABALL_DROP_REACH_RANGE[0];
  const reachEnd = collapse * METABALL_DROP_REACH_RANGE[1];
  const gooEnd = collapse * METABALL_GOO_RAMP;
  const gooFade = collapse * METABALL_GOO_FADE;
  const presenceStops = METABALL_PRESENCE_STOPS.map((stop) => stop * collapse);

  const expand = useDerivedValue<number>(() => clamp(progress.get(), 0, 1));

  const liquify = useDerivedValue<number>(() =>
    interpolate(
      expand.get(),
      METABALL_LIQUIFY_EXPAND_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  );

  const flow = useLiquifyClock(liquify);

  const gate = useDerivedValue<number>(
    () => (1 - expand.get()) * (1 - calm.get()),
  );

  const travel = useDerivedValue<number>(() => {
    const offset = scrollY.get();

    if (offset <= 0) {
      return offset;
    }

    return Math.max(offset - anchor.get(), 0);
  });

  const centerY = useDerivedValue<number>(
    () =>
      interpolate(travel.get(), [0, collapse], [restCenterY, islandCenterY], {
        extrapolateLeft: Extrapolation.EXTEND,
        extrapolateRight: Extrapolation.CLAMP,
      }) +
      bannerExtra * progress.get(),
  );

  const radius = useDerivedValue<number>(() =>
    interpolate(
      travel.get(),
      [-PULL_DISTANCE, 0, collapse / 2, collapse],
      [
        restRadius * PULL_SCALE,
        restRadius,
        restRadius * METABALL_RADIUS_MID_RATIO,
        endRadius,
      ],
      Extrapolation.CLAMP,
    ),
  );

  const darkness = useDerivedValue<number>(() =>
    interpolate(
      travel.get(),
      [darkenStart, darkenEnd],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  );

  const blur = useDerivedValue<number>(() =>
    interpolate(
      travel.get(),
      [blurStart, blurEnd],
      [0, METABALL_BLUR_MAX],
      Extrapolation.CLAMP,
    ),
  );

  const goo = useDerivedValue<number>(
    () =>
      interpolate(
        travel.get(),
        [0, gooEnd, gooFade, collapse],
        [METABALL_GOO_MIN, METABALL_GOO_MAX, METABALL_GOO_MAX, 0],
        Extrapolation.CLAMP,
      ) * gate.get(),
  );

  const presence = useDerivedValue<number>(
    () =>
      (isHardware
        ? 1
        : interpolate(
            travel.get(),
            presenceStops,
            METABALL_PRESENCE_SCALES,
            Extrapolation.CLAMP,
          )) * gate.get(),
  );

  const blend = useDerivedValue<number>(() =>
    interpolate(
      travel.get(),
      [blendStart, blendEnd],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  );

  const tip = useDerivedValue<number>(
    () => radius.get() * METABALL_DROP_TIP_RATIO,
  );

  const stretch = useDerivedValue<number>(() => {
    const base = radius.get() - tip.get();
    const full = Math.max(base, centerY.get() - islandBottom);
    const reach = interpolate(
      travel.get(),
      [reachStart, reachEnd],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return base + (full - base) * reach;
  });

  return useMemo<TMetaballMotion>(
    () => ({
      blend,
      blur,
      centerY,
      darkness,
      expand,
      flow,
      goo,
      liquify,
      presence,
      radius,
      stretch,
      tip,
    }),
    [
      blend,
      blur,
      centerY,
      darkness,
      expand,
      flow,
      goo,
      liquify,
      presence,
      radius,
      stretch,
      tip,
    ],
  );
};

export { useMetaballMotion };
