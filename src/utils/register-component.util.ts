import { memo, type ComponentType, type NamedExoticComponent } from "react";

/**
 * this is a must.
 */
const registerComponent = <TProps extends object>(
  name: string,
  component: ComponentType<TProps>,
): NamedExoticComponent<TProps> => {
  const memoized: NamedExoticComponent<TProps> = memo(component);

  memoized.displayName = name;
  return memoized;
};

export { registerComponent };
