import { Platform } from "react-native";
import type { TArtistMedia } from "./interface";

const ARTIST_PHOTO_URL: string =
  "https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages122/v4/fc/05/ea/fc05eaef-da77-d1a1-cccd-058d2668beaf/1fbd4b36-578b-4bad-be97-d4910f004da8_ami-identity-6a4cdfcea5ca482d082ae1239048d924-2024-03-13T19-39-37.988Z_cropped.png/1000x1000bb.jpg";
const ARTIST_VIDEO_URL: string =
  "https://mvod.itunes.apple.com/itunes-assets/HLSMusic211/v4/d5/4f/6f/d54f6fb2-cda7-89ea-cf03-f255bdbf5727/P847922692_Anull_video_gr290_sdr_1080x1080-.mp4";
const ARTIST_VIDEO_URL_LOW: string =
  "https://mvod.itunes.apple.com/itunes-assets/HLSMusic211/v4/b6/b9/9e/b6b99e48-291a-7e8d-4acc-09956584937a/P847922692_Anull_video_gr230_sdr_486x486-.mp4";
const ARTIST_MEDIA: TArtistMedia = {
  photoUrl: ARTIST_PHOTO_URL,
  videoUrl: Platform.OS === "android" ? ARTIST_VIDEO_URL_LOW : ARTIST_VIDEO_URL,
};

export { ARTIST_MEDIA };
