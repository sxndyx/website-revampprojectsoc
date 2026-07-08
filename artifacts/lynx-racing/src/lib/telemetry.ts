import { useEffect, useState } from "react";

export interface Telemetry {
  voltage: string;
  status: string;
  mode: string;
  system: string;
}

// Honest, development-stage "live" readout. Voltage drifts gently around a
// target bench value; status/mode reflect the team's real current stage.
export function useLiveTelemetry(): Telemetry {
  const [voltage, setVoltage] = useState(748);

  useEffect(() => {
    const id = setInterval(() => {
      setVoltage((v) => {
        const next = v + (Math.random() - 0.5) * 6;
        return Math.max(738, Math.min(762, next));
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return {
    voltage: `${voltage.toFixed(0)} V`,
    status: "DEVELOPMENT",
    mode: "GARAGE",
    system: "ONLINE",
  };
}
