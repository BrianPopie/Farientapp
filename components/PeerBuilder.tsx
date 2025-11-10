"use client";

import companies from "@/data/companies.json";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePeerStore } from "@/store/usePeers";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

const sectors = ["Technology", "Industrials", "Consumer", "Healthcare"];
const revenueBands = ["<$1B", "$1B - $5B", "$5B+", "Custom"];
const marketCaps = ["Small", "Mid / Large", "Mega"];
const regions = ["North America", "Europe", "APAC"];

export function PeerBuilder() {
  const { baseCompanyId, filters, peerSet, setBaseCompany, setFilters } = usePeerStore();

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">Base company</p>
          <Select value={baseCompanyId} onValueChange={setBaseCompany}>
            <SelectTrigger className="mt-1 w-full sm:w-72">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name} ({company.ticker})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" className="gap-2 text-text" type="button" onClick={() => setFilters({ sector: "Technology" })}>
          <Shuffle className="h-4 w-4" />
          Rebuild peers
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Select value={filters.sector} onValueChange={(value) => setFilters({ sector: value })}>
          <SelectTrigger>
            <div className="text-left">
              <p className="text-[0.75rem] uppercase text-text-muted">Sector</p>
              <SelectValue placeholder="Select sector" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {sectors.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.revenueBand} onValueChange={(value) => setFilters({ revenueBand: value })}>
          <SelectTrigger>
            <div className="text-left">
              <p className="text-[0.75rem] uppercase text-text-muted">Revenue band</p>
              <SelectValue placeholder="Select band" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {revenueBands.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.marketCap} onValueChange={(value) => setFilters({ marketCap: value })}>
          <SelectTrigger>
            <div className="text-left">
              <p className="text-[0.75rem] uppercase text-text-muted">Market cap</p>
              <SelectValue placeholder="Select market cap" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {marketCaps.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.region} onValueChange={(value) => setFilters({ region: value })}>
          <SelectTrigger>
            <div className="text-left">
              <p className="text-[0.75rem] uppercase text-text-muted">Region</p>
              <SelectValue placeholder="Select region" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {regions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-wide text-text-muted">Selected peers</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {peerSet.map((peer) => (
            <Badge key={peer} variant="outline" className="border-border bg-surface">
              {peer}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
