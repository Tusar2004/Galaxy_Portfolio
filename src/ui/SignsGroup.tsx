import DirectionSign from "./DirectionSign";

export default function SignsGroup() {
  return (
    <group>
      <group position={[6, -1.4, -5]}>
        <DirectionSign label="→ Projects" rotation={-0.6} />
      </group>
      <group position={[-6, -1.4, -4]}>
        <DirectionSign label="← Skills" rotation={0.9} />
      </group>
      <group position={[9, -1.1, 2]}>
        <DirectionSign label="↗ Photography" rotation={-1.0} />
      </group>
    </group>
  );
}
