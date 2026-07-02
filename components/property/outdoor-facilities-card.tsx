import * as React from "react";
import { Hospital, School, Store, Landmark, Bus, Dumbbell, Train } from "lucide-react";
import { OutdoorFacility } from "@/lib/types";

interface OutdoorFacilitiesCardProps {
  facilities?: OutdoorFacility[];
}

export function OutdoorFacilitiesCard({ facilities }: OutdoorFacilitiesCardProps) {
  if (!facilities || facilities.length === 0) return null;

  // Map facility types to human labels and matching Lucide Icons
  const facilityConfig: Record<
    string,
    { label: string; icon: React.ComponentType<any> }
  > = {
    hospital: { label: "Hospital", icon: Hospital },
    school: { label: "School", icon: School },
    supermarket: { label: "Supermarket", icon: Store },
    bank_atm: { label: "Bank ATM", icon: Landmark },
    bus_stop: { label: "Bus Stop", icon: Bus },
    metro: { label: "Metro", icon: Train },
    gym: { label: "Gym", icon: Dumbbell },
  };

  return (
    <div className="rounded-2xl border border-border-default/60 bg-bg-surface p-5 shadow-sm text-left animate-fade-in">
      <h3 className="font-heading text-base font-bold text-text-primary mb-5">
        Outdoor Facilities
      </h3>

      <div className="space-y-4">
        {facilities.map((fac, idx) => {
          const config = facilityConfig[fac.facilityType] || {
            label: fac.facilityType.replace("_", " "),
            icon: Landmark,
          };
          const Icon = config.icon;

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-alt/70 border border-border-default/50">
                <Icon className="h-5.5 w-5.5 text-accent-primary" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-text-primary leading-tight">
                  {config.label}
                </h4>
                <p className="text-xs font-medium text-text-muted">
                  {fac.distance}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
