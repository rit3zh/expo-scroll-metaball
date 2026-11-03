import { Stack } from "expo-router";
import { memo, type FC, type FunctionComponent } from "react";

const RootLayout: FC & FunctionComponent = (): React.ReactNode &
  React.JSX.Element => <Stack screenOptions={{ headerShown: false }} />;

export default memo(RootLayout);
