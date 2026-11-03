import type { FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { registerComponent } from "@/utils/register-component.util";
import type { ISkeletonSectionTitle } from "./interface";

const SkeletonSectionTitleBase: FC<ISkeletonSectionTitle> = ({
  width,
}: ISkeletonSectionTitle &
  React.ComponentProps<typeof SkeletonSectionTitleBase>): React.ReactNode &
  React.JSX.Element => <Skeleton height={16} width={width} />;

const SkeletonSectionTitle = registerComponent(
  "SkeletonSectionTitle",
  SkeletonSectionTitleBase,
);

export { SkeletonSectionTitle };
