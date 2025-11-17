import KeyboardKey from "./KeyboardKey";

export default function KeyboardKeysCluster() {
  const keySpacing = 0.46;
  return (
    <group scale={0.95}>
      <KeyboardKey label="W" position={[0, 0.24, -keySpacing]} scatterRadius={0.9} />
      <KeyboardKey label="A" position={[-keySpacing, -0.18, 0]} scatterRadius={0.9} />
      <KeyboardKey label="S" position={[0, -0.18, 0]} scatterRadius={0.9} />
      <KeyboardKey label="D" position={[keySpacing, -0.18, 0]} scatterRadius={0.9} />
      <KeyboardKey label="Shift" position={[-1.4, -0.18, keySpacing * 0.6]} size={[0.9, 0.12, 0.36]} scatterRadius={0.8} />
    </group>
  );
}
