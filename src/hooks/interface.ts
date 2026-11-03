type TIslandFrame = {
  centerX: number;
  centerY: number;
  halfHeight: number;
  halfWidth: number;
  isHardware: boolean;
};

type TMetaballLayout = {
  avatarCenterY: number;
  avatarCollapse: number;
  avatarRadius: number;
  bannerExtra: number;
  canvasHeight: number;
  contentInset: number;
  island: TIslandFrame;
  minContentHeight: number;
  pixel: number;
  screenWidth: number;
  snapOffsets: number[];
};

export { type TIslandFrame, type TMetaballLayout };
