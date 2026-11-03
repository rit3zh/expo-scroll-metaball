# expo-scroll-metaball

Metaball profile header for React Native that melts into the Dynamic Island as you scroll.

<!-- Add the demo video link here -->

---

## ⚙️ Installation

```bash
git clone https://github.com/rit3zh/expo-scroll-metaball
cd expo-scroll-metaball
bun install
bunx expo run:ios
```

This uses native modules (`react-native-tgfx`, `expo-backdrop`), so it needs a development build and won't run in Expo Go. `bun install` applies the `react-native-tgfx` patch in [`patches/`](patches) automatically.

Peer dependencies (already set up in this template):

```bash
bunx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-backdrop
bun add react-native-tgfx react-native-nitro-modules
```

The effect lives in [`src/components/metaball-avatar`](src/components/metaball-avatar). The demo profile screen is in [`src/components/metaball-screen`](src/components/metaball-screen).

---

## 🚀 Usage

`MetaballAvatar` is a full-screen overlay drawn by a single SkSL shader. It reads the scroll state from `useMetaballScroll` and the screen geometry from `useMetaballLayout`, so you put it above your own `Animated.ScrollView`:

```tsx
import { MetaballAvatar } from "@/components/metaball-avatar";
import { useMetaballScroll } from "@/components/metaball-screen/hooks/use-metaball-scroll";
import { useMetaballLayout } from "@/hooks/use-metaball-layout";

export function Profile() {
  const layout = useMetaballLayout();
  const { anchor, calm, expand, isBannerLocked, onScroll, scrollRef, scrollY } =
    useMetaballScroll();

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToOffsets={layout.snapOffsets}
        contentContainerStyle={{
          minHeight: layout.minContentHeight,
          paddingTop: layout.contentInset,
        }}
      >
        <Content />
      </Animated.ScrollView>
      <MetaballAvatar
        anchor={anchor}
        calm={calm}
        expand={expand}
        isLocked={isBannerLocked}
        layout={layout}
        scrollY={scrollY}
      />
    </View>
  );
}
```

`layout.contentInset` keeps your content below the avatar, and `layout.snapOffsets` snaps the scroll to either the resting avatar or the fully merged one.

When the banner is open, the content has to move down with it. Translate it by `layout.bannerExtra * expand`:

```tsx
const rowsStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: layout.bannerExtra * expand.get() }],
}));
```

Scroll up and the avatar blurs, darkens and stretches into a drop that merges with the island. Pull down past the threshold and it springs open into a full-width banner. The artist video fades in and starts playing, and the bottom edge liquifies into drips. Scroll back up to close it. On devices without a Dynamic Island, a small blob is drawn where the island would be, so the merge still works.

The photo and video come from [`artist.const.ts`](src/constants/artist.const.ts). Android gets a lower-resolution video.

---

## 🧩 API

### `<MetaballAvatar>`

| Prop       | Type                  | Default | Description                                                     |
| ---------- | --------------------- | ------- | --------------------------------------------------------------- |
| `scrollY`  | `SharedValue<number>` | none    | Current scroll offset.                                          |
| `expand`   | `SharedValue<number>` | none    | Banner progress, `0` closed to `1` open.                        |
| `anchor`   | `SharedValue<number>` | none    | Offset the avatar holds at while the banner is closing.         |
| `calm`     | `SharedValue<number>` | none    | Turns off the goo and island merge while the list scrolls back. |
| `isLocked` | `boolean`             | none    | Whether the banner is open. Plays or pauses the video.          |
| `layout`   | `TMetaballLayout`     | none    | Screen geometry from `useMetaballLayout()`.                     |

### `useMetaballScroll()`

Owns the scroll gesture. It returns `onScroll` and `scrollRef` for the `Animated.ScrollView`, the `scrollY`, `expand`, `anchor` and `calm` shared values for the avatar, and `isBannerLocked`, which the demo also uses to hide the status bar.

### `useMetaballLayout()`

Works out the avatar, island and banner geometry from the window size and safe area. It returns `contentInset`, `minContentHeight`, `snapOffsets`, `bannerExtra`, the `island` frame and the values the shader needs.

### Config

Defaults live in three files:

- [`layout.const.ts`](src/constants/layout.const.ts): avatar size, banner height, pull distance and Dynamic Island size.
- [`metaball-avatar.const.ts`](src/constants/components/metaball-avatar.const.ts): blur, goo, drop shape, liquify and drip timing, video fade and the SkSL shader.
- [`metaball-screen.const.ts`](src/constants/components/metaball-screen.const.ts): pull-to-open threshold, banner spring and header blur.

---

## 🧱 Stack

[Expo SDK 58](https://expo.dev/changelog) · [React Native 0.88](https://reactnative.dev/) · [react-native-tgfx](https://www.npmjs.com/package/react-native-tgfx) · [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/) · [Worklets](https://docs.swmansion.com/react-native-worklets/) · [expo-backdrop](https://www.npmjs.com/package/expo-backdrop) · [Expo Router](https://docs.expo.dev/router/introduction/)

---
