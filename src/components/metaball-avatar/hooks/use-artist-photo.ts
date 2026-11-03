import { useEffect, useState } from "react";
import { loadImage, type TgfxImage } from "react-native-tgfx";
import type { TArtistPhoto } from "../interface";

const useArtistPhoto = <T extends string | null>(url: T): TgfxImage | null => {
  const [photo, setPhoto] = useState<TArtistPhoto | null>(null);

  useEffect(() => {
    if (url === null) {
      return undefined;
    }

    const _aborter: AbortController = new AbortController();
    let loaded: TgfxImage | null = null;

    loadImage(url, _aborter.signal)
      .then((image: TgfxImage) => {
        if (_aborter.signal.aborted) {
          image.dispose();
          return;
        }

        loaded = image;
        setPhoto({ image, url });
      })
      .catch((error) => {
        if (!_aborter.signal.aborted) {
          console.warn("Artist photo failed to load:", error);
        }
      });

    return (): void => {
      _aborter.abort();
      loaded?.dispose();
    };
  }, [url]);

  return photo?.url === url ? photo.image : null;
};

export { useArtistPhoto };
