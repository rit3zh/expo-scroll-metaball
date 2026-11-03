import type { DerivedValue, SharedValue } from "react-native-reanimated";
import type { ImageLike, TgfxImage, UniformValue } from "react-native-tgfx";

import type { TMetaballLayout } from "@/hooks/interface";

interface IMetaballAvatar {
  anchor: SharedValue<number>;
  calm: SharedValue<number>;
  expand: SharedValue<number>;
  isLocked: SharedValue<boolean>;
  layout: TMetaballLayout;
  scrollY: SharedValue<number>;
}

type TArtistPhoto = {
  image: TgfxImage;
  url: string;
};

type TBannerVideo = {
  frame: ImageLike | null;
  mix: DerivedValue<number>;
};

type TMetaballMotion = {
  blend: DerivedValue<number>;
  blur: DerivedValue<number>;
  centerY: DerivedValue<number>;
  darkness: DerivedValue<number>;
  expand: DerivedValue<number>;
  flow: SharedValue<number>;
  goo: DerivedValue<number>;
  liquify: DerivedValue<number>;
  presence: DerivedValue<number>;
  radius: DerivedValue<number>;
  stretch: DerivedValue<number>;
  tip: DerivedValue<number>;
};

type TMetaballUniforms = Record<string, UniformValue>;

type TPhotoSize = {
  height: number;
  width: number;
};

export {
  type IMetaballAvatar,
  type TArtistPhoto,
  type TBannerVideo,
  type TMetaballMotion,
  type TMetaballUniforms,
  type TPhotoSize,
};
