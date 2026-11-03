const toFloat32 = Math.fround;

const shaderHash = <T extends number>(x: T, y: T): number => {
  const _dot: number = toFloat32(
    toFloat32(toFloat32(x) * toFloat32(12.9898)) +
      toFloat32(toFloat32(y) * toFloat32(78)),
  );
  const value: number = toFloat32(
    toFloat32(Math.sin(_dot)) * toFloat32(43758.5453),
  );

  return value - Math.floor(value);
};

export { shaderHash };
