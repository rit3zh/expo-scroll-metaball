import type { FC } from "react";
import { StyleSheet, View } from "react-native";

import {
  SKELETON_SONGS,
  SKELETON_SONGS_TITLE_WIDTH,
} from "@/constants/components/metaball-screen.const";
import type { TSkeletonSong } from "@/constants/interface";
import { registerComponent } from "@/utils/register-component.util";
import { SkeletonSectionTitle } from "./skeleton-section-title";
import { SkeletonSongRow } from "./skeleton-song-row";

const SkeletonTopSongsBase: FC = (): React.ReactNode & React.JSX.Element => (
  <View style={styles.section}>
    <SkeletonSectionTitle width={SKELETON_SONGS_TITLE_WIDTH} />
    <View style={styles.songs}>
      {SKELETON_SONGS.map(
        (song: TSkeletonSong): React.JSX.Element => (
          <SkeletonSongRow key={song.id} song={song} />
        ),
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    gap: 18,
  },
  songs: {
    gap: 16,
  },
});

const SkeletonTopSongs = registerComponent(
  "SkeletonTopSongs",
  SkeletonTopSongsBase,
);

export { SkeletonTopSongs };
