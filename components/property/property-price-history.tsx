import * as React from "react";
import { cn } from "@/lib/utils";
import type { MockProperty, PriceHistoryEntry, TaxHistoryEntry } from "@/src/mocks/propertyTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight, DollarSign, Key, Tag, CalendarRange, Ban } from "lucide-react";

interface PropertyPriceHistoryProps {
  property: MockProperty;
  className?: string;
}

const EVENT_LABEL: Record<PriceHistoryEntry["event"], string> = {
  listed: "Listed for Sale",
  price_drop: "Price Dropped",
  price_increase: "Price Increased",
  sold: "Sold",
  rented: "Rented",
  relisted: "Relisted",
  expired: "Listing Expired",
};

const EVENT_ICON: Record<PriceHistoryEntry["event"], React.ReactNode> = {
  listed: <Tag className="h-4 w-4" />,
  price_drop: <ArrowDownRight className="h-4 w-4 text-state-success" />,
  price_increase: <ArrowUpRight className="h-4 w-4 text-state-error" />,
  sold: <DollarSign className="h-4 w-4 text-text-muted" />,
  rented: <Key className="h-4 w-4 text-text-muted" />,
  relisted: <CalendarRange className="h-4 w-4 text-accent-primary" />,
  expired: <Ban className="h-4 w-4 text-text-faint" />,
};

const EVENT_BADGE_STYLE: Record<PriceHistoryEntry["event"], string> = {
  listed: "bg-accent-primary-dim text-accent-primary border-accent-primary/20",
  price_drop: "bg-state-success/15 text-state-success border-state-success/20",
  price_increase: "bg-state-error/15 text-state-error border-state-error/20",
  sold: "bg-accent-navy/10 text-accent-navy border-accent-navy/10",
  rented: "bg-state-info/15 text-state-info border-state-info/20",
  relisted: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  expired: "bg-bg-elevated text-text-muted border-border-default/40",
};

export function PropertyPriceHistory({ property, className }: PropertyPriceHistoryProps) {
  // Format price helper
  const formatVal = (amount: number, currency: string) => {
    const symbol = currency === "USD" ? "$" : currency + " ";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const hasPriceHistory = property.priceHistory && property.priceHistory.length > 0;
  const hasTaxHistory = property.taxHistory && property.taxHistory.length > 0;

  // Sort history chronologically descending (newest first) for timeline display
  const sortedPriceHistory = hasPriceHistory
    ? [...property.priceHistory].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  return (
    <div className={cn("grid gap-8 lg:grid-cols-2", className)}>
      {/* Price History Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary border-b border-border-default/50 pb-2">
          Price History
        </h3>
        {hasPriceHistory ? (
          <div className="relative border-l border-border-default/70 ml-4 pl-6 space-y-6 py-2">
            {sortedPriceHistory.map((item, idx) => {
              const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div key={idx} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[35px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-border-default bg-bg-surface shadow-sm group-hover:border-accent-primary transition-colors duration-200">
                    {EVENT_ICON[item.event] ?? <Tag className="h-3.5 w-3.5" />}
                  </div>

                  {/* Timeline content */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {formatVal(item.price, item.currency)}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] border px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                          EVENT_BADGE_STYLE[item.event]
                        )}
                      >
                        {EVENT_LABEL[item.event]}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted font-medium">{formattedDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default/60 bg-bg-alt/20 py-8 px-6 text-center text-sm text-text-muted">
            No price history events on record for this listing.
          </div>
        )}
      </div>

      {/* Tax History Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-primary border-b border-border-default/50 pb-2">
          Tax History
        </h3>
        {hasTaxHistory ? (
          <div className="overflow-hidden rounded-2xl border border-border-default/50 bg-bg-surface">
            <Table>
              <TableHeader className="bg-bg-alt/50 border-border-default/40">
                <TableRow className="border-border-default/45">
                  <TableHead className="font-bold text-text-secondary pl-5 py-3">Year</TableHead>
                  <TableHead className="font-bold text-text-secondary text-right pr-5 py-3">Tax Assessed Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.taxHistory.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-bg-alt/30 border-border-default/40">
                    <TableCell className="font-semibold text-text-secondary pl-5 py-3.5">
                      {item.year}
                    </TableCell>
                    <TableCell className="text-right text-text-primary font-bold pr-5 py-3.5">
                      {formatVal(item.taxValue, item.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border-default/60 bg-bg-alt/20 py-8 px-6 text-center text-sm text-text-muted">
            No tax history records available for this listing.
          </div>
        )}
      </div>
    </div>
  );
}
