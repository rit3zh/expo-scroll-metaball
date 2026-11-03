import { MetaballScreen } from "@/components/metaball-screen";
import { memo, type FC, type FunctionComponent } from "react";

const Index: FC & FunctionComponent = (): React.ReactNode &
  React.JSX.Element &
  React.ReactElement => <MetaballScreen />;

export default memo(Index);
