import type { ImageLike } from "react-native-tgfx";
import type { TPhotoSize } from "../interface";

const resolvePhotoSize = <T extends ImageLike>(photo: T | null): TPhotoSize => {
  if (photo === null) {
    return { height: 1, width: 1 };
  }
  return { height: photo.height, width: photo.width };
};

export { resolvePhotoSize };
