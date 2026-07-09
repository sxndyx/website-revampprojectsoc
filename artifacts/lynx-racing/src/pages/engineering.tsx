import { useSeo } from "@/hooks/useSeo";
import { ModulePlaceholder } from "@/components/ModulePlaceholder";

export default function Engineering() {
  useSeo({
    title: "Engineering",
    description:
      "The technical program behind the Lynx Racing prototype — battery, powertrain, chassis, controls and aero, documented as the build comes together.",
  });

  return (
    <ModulePlaceholder
      code="02 — ENGINEERING"
      title="Engineering"
      blurb="The full technical program — battery, powertrain, chassis, controls and aerodynamics — is being documented here as the prototype comes together."
      items={[
        "Battery & BMS architecture",
        "Powertrain & inverter",
        "Twin-spar chassis & FEA",
        "Suspension kinematics",
        "Cooling & thermal",
        "Aerodynamics & CFD",
        "Telemetry & controls",
      ]}
    />
  );
}
