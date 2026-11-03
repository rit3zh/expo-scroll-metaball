import {
  METABALL_CROP_BIAS_Y,
  METABALL_FADE_SOFTNESS,
  METABALL_FADE_SOFTNESS_MIN,
  METABALL_LIQUIFY_AMPLITUDE,
  METABALL_LIQUIFY_MELT_PULL,
  METABALL_LIQUIFY_MELT_START,
  METABALL_LIQUIFY_REACH,
  METABALL_LIQUIFY_SCALE,
  METABALL_SHADER_SOURCE,
  METABALL_VIDEO_CROP_BIAS_Y,
} from "@/constants/components/metaball-avatar.const";
import { ARTIST_MEDIA } from "@/constants/artist.const";
import type { TPalette } from "@/constants/interface";
import { usePalette } from "@/hooks/use-palette";
import { registerComponent } from "@/utils/register-component.util";
import { useMemo, type FC } from "react";
import { StyleSheet, View } from "react-native";
import {
  Canvas,
  ColorShader,
  ImageShader,
  Rect,
  Shader,
} from "react-native-tgfx";

import { useArtistPhoto } from "./hooks/use-artist-photo";
import { useBannerVideo } from "./hooks/use-banner-video";
import { useMetaballMotion } from "./hooks/use-metaball-motion";
import type {
  IMetaballAvatar,
  TBannerVideo,
  TMetaballMotion,
  TMetaballUniforms,
  TPhotoSize,
} from "./interface";
import { resolvePhotoSize } from "./utils/resolve-photo-size.util";

const MetaballAvatarBase: FC<IMetaballAvatar> = ({
  anchor,
  calm,
  expand,
  isLocked,
  layout,
  scrollY,
}: IMetaballAvatar &
  React.ComponentProps<typeof MetaballAvatarBase>): React.ReactNode &
  React.JSX.Element => {
  const palette: TPalette = usePalette();
  const photo = useArtistPhoto(ARTIST_MEDIA.photoUrl);
  const motion: TMetaballMotion = useMetaballMotion(
    scrollY,
    expand,
    anchor,
    calm,
    layout,
  );
  const video: TBannerVideo = useBannerVideo(
    ARTIST_MEDIA.videoUrl,
    isLocked,
    motion.expand,
  );
  const size = useMemo<TPhotoSize>(() => resolvePhotoSize(photo), [photo]);
  const videoSize = useMemo<TPhotoSize>(
    () => resolvePhotoSize(video.frame),
    [video.frame],
  );
  const island = layout.island;

  const uniforms = useMemo<TMetaballUniforms>(
    () => ({
      uAvatar: [island.centerX, motion.centerY, motion.radius, motion.darkness],
      uBanner: [motion.expand, layout.screenWidth],
      uDrop: [motion.stretch, motion.tip],
      uEffect: [motion.blur, motion.goo, motion.presence, layout.pixel],
      uFade: [METABALL_FADE_SOFTNESS, METABALL_FADE_SOFTNESS_MIN],
      uFlow: [motion.flow, motion.liquify],
      uImage: [size.width, size.height, METABALL_CROP_BIAS_Y, motion.blend],
      uLiquify: [
        METABALL_LIQUIFY_AMPLITUDE,
        METABALL_LIQUIFY_SCALE,
        METABALL_LIQUIFY_REACH,
        layout.canvasHeight,
      ],
      uMelt: [METABALL_LIQUIFY_MELT_START, METABALL_LIQUIFY_MELT_PULL],
      uIsland: [
        island.centerX,
        island.centerY,
        island.halfWidth,
        island.halfHeight,
      ],
      uVideoImage: [
        videoSize.width,
        videoSize.height,
        METABALL_VIDEO_CROP_BIAS_Y,
        video.mix,
      ],
    }),
    [island, layout, motion, size, video.mix, videoSize],
  );

  return (
    <View style={[styles.overlay, { height: layout.canvasHeight }]}>
      <Canvas composite="texture" style={styles.canvas}>
        <Rect
          x={0}
          y={0}
          width={layout.screenWidth}
          height={layout.canvasHeight}
        >
          <Shader source={METABALL_SHADER_SOURCE} uniforms={uniforms}>
            {photo === null ? (
              <ColorShader color={palette.placeholder} />
            ) : (
              <ImageShader image={photo} sampling="linear" />
            )}
            {video.frame === null ? (
              <ColorShader color={palette.placeholder} />
            ) : (
              <ImageShader image={video.frame} sampling="linear" />
            )}
          </Shader>
        </Rect>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
  overlay: {
    left: 0,
    pointerEvents: "none",
    position: "absolute",
    right: 0,
    top: 0,
  },
});

const MetaballAvatar = registerComponent("MetaballAvatar", MetaballAvatarBase);

export { MetaballAvatar };
