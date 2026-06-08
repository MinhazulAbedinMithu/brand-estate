import * as React from "react";
import { cn } from "@/lib/utils";
import type { MockProperty } from "@/src/mocks/propertyTypes";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Check, X } from "lucide-react";

interface PropertySpecsProps {
  property: MockProperty;
  className?: string;
}

const ROOF_TYPE_LABEL: Record<string, string> = {
  asphalt_shingle: "Asphalt Shingle",
  metal: "Metal",
  clay_tile: "Clay Tile",
  flat: "Flat",
  slate: "Slate",
  wood_shake: "Wood Shake",
};

const FOUNDATION_TYPE_LABEL: Record<string, string> = {
  concrete_slab: "Concrete Slab",
  crawl_space: "Crawl Space",
  full_basement: "Full Basement",
  pier_and_beam: "Pier & Beam",
  stem_wall: "Stem Wall",
};

const ROOM_TYPE_LABEL: Record<string, string> = {
  private: "Private Room",
  shared: "Shared Room",
};

const BATHROOM_TYPE_LABEL: Record<string, string> = {
  attached: "Attached (Private)",
  common: "Common (Shared)",
};

const GENDER_LABEL: Record<string, string> = {
  any: "No Preference (Any)",
  male: "Male Only",
  female: "Female Only",
};

const UTILITY_LABEL: Record<string, string> = {
  wifi: "High-Speed Wi-Fi",
  gas: "Gas",
  water: "Water",
  electricity: "Electricity",
  cable: "Cable TV",
  trash: "Trash Collection",
};

const ZONING_LABEL: Record<string, string> = {
  retail: "Retail (Commercial)",
  office: "Office Space",
  industrial: "Industrial / Light Mfg",
  warehouse: "Warehouse / Logistics",
};

export function PropertySpecs({ property, className }: PropertySpecsProps) {
  // Format currency helpers
  const formatCurrency = (amount: number) => {
    const symbol = property.currency === "USD" ? "$" : property.currency + " ";
    return `${symbol}${amount.toLocaleString()}`;
  };

  // ─── Render Helper functions ───────────────────────────────────────────────

  const renderBaseSpecs = () => {
    const baseItems = [
      { label: "Total Rooms", value: property.totalRooms },
      { label: "Bedrooms", value: property.bedrooms },
      { label: "Bathrooms", value: property.bathrooms },
      { label: "Square Footage", value: `${property.squareFeet.toLocaleString()} sq ft` },
      { label: "Square Meters", value: `${property.squareMeters.toLocaleString()} m²` },
      { label: "Year Built", value: property.yearBuilt },
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary border-b border-border-default/50 pb-2">
          Key Information
        </h3>
        <div className="overflow-hidden rounded-2xl border border-border-default/50 bg-bg-surface">
          <Table>
            <TableBody>
              {baseItems.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-bg-alt/30 border-border-default/40">
                  <TableCell className="font-semibold text-text-secondary py-3.5 pl-5">
                    {item.label}
                  </TableCell>
                  <TableCell className="text-right text-text-primary font-medium py-3.5 pr-5">
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderClassSpecs = () => {
    switch (property.propertyCategory) {
      case "apartment": {
        const apt = property.apartment;
        const items = [
          { label: "Floor", value: `${apt.floorNumber} of ${apt.totalBuildingFloors}` },
          { label: "Monthly Maintenance Fee", value: formatCurrency(apt.monthlyMaintenanceFee) },
          {
            label: "Elevator",
            value: apt.hasElevator ? (
              <span className="inline-flex items-center gap-1.5 text-state-success font-semibold">
                <Check className="h-4 w-4" /> Yes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <X className="h-4 w-4" /> No
              </span>
            ),
          },
          { label: "Parking Slot", value: apt.parkingSlotNumber ?? "None allocated" },
        ];
        return { title: "Apartment Details", items };
      }

      case "house": {
        const hse = property.house;
        const items = [
          { label: "Lot Size (Acres)", value: `${hse.lotSizeAcres} acres` },
          { label: "Lot Size (Sq Ft)", value: `${hse.lotSizeSqFt.toLocaleString()} sq ft` },
          { label: "Garage Spaces", value: hse.garageSpacesCount },
          { label: "Roof Type", value: ROOF_TYPE_LABEL[hse.roofType] ?? hse.roofType },
          { label: "Foundation", value: FOUNDATION_TYPE_LABEL[hse.foundationType] ?? hse.foundationType },
          { label: "HVAC System", value: hse.heatingCoolingSystem },
          { label: "Backyard Area", value: `${hse.backyardAreaSqFt.toLocaleString()} sq ft` },
        ];
        return { title: "House Structural Specs", items };
      }

      case "room_share": {
        const rs = property.roomShare;
        const items = [
          { label: "Room Style", value: ROOM_TYPE_LABEL[rs.roomType] ?? rs.roomType },
          { label: "Bathroom", value: BATHROOM_TYPE_LABEL[rs.bathroomType] ?? rs.bathroomType },
          { label: "Current Occupants", value: `${rs.currentOccupantsCount} roommate(s)` },
          { label: "Gender Preference", value: GENDER_LABEL[rs.preferredGender] ?? rs.preferredGender },
          {
            label: "Utilities Included",
            value: rs.utilitiesIncluded.length > 0 
              ? rs.utilitiesIncluded.map(u => UTILITY_LABEL[u] ?? u).join(", ")
              : "None included",
          },
          { label: "Min Lease Term", value: `${rs.minimumLeasePeriodMonths} months` },
        ];
        return { title: "Co-Living & Shared Room Rules", items };
      }

      case "commercial": {
        const comm = property.commercial;
        const items = [
          { label: "Zoning Classification", value: ZONING_LABEL[comm.zoningCode] ?? comm.zoningCode },
          { label: "Loading Docks", value: comm.loadingDocksCount },
          { label: "Ceiling Height", value: `${comm.ceilingHeightFt} feet` },
          { label: "Minimum Lease Period", value: `${comm.minimumLeaseTermYears} years` },
          { label: "Power Capacity", value: comm.electricalCapacity },
        ];
        return { title: "Commercial Features", items };
      }

      default:
        return null;
    }
  };

  const classSpecs = renderClassSpecs();

  return (
    <div className={cn("grid gap-8 md:grid-cols-2", className)}>
      {/* General Core Specs */}
      {renderBaseSpecs()}

      {/* Class Specific Specs */}
      {classSpecs && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-text-primary border-b border-border-default/50 pb-2">
            {classSpecs.title}
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border-default/50 bg-bg-surface">
            <Table>
              <TableBody>
                {classSpecs.items.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-bg-alt/30 border-border-default/40">
                    <TableCell className="font-semibold text-text-secondary py-3.5 pl-5">
                      {item.label}
                    </TableCell>
                    <TableCell className="text-right text-text-primary font-medium py-3.5 pr-5">
                      {item.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
