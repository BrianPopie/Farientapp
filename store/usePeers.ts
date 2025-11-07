import { create } from "zustand";
import peers from "@/data/peers.json";
import companies from "@/data/companies.json";

export type PeerFilters = {
  sector: string;
  revenueBand: string;
  marketCap: string;
  region: string;
};

export type PeerState = {
  baseCompanyId: string;
  filters: PeerFilters;
  peerSet: string[];
  setBaseCompany: (id: string) => void;
  setFilters: (partial: Partial<PeerFilters>) => void;
  setPeerSet: (peers: string[]) => void;
};

const defaultFilters: PeerFilters = {
  sector: "Technology",
  revenueBand: "$1B - $5B",
  marketCap: "Mid / Large",
  region: "North America"
};

export const usePeerStore = create<PeerState>((set, get) => ({
  baseCompanyId: companies[0]?.id ?? "aur",
  filters: defaultFilters,
  peerSet: peers.find((p) => p.companyId === (companies[0]?.id ?? "aur"))?.peers ?? [],
  setBaseCompany: (id) => {
    const current = get();
    if (current.baseCompanyId === id) {
      return;
    }
    set({
      baseCompanyId: id,
      peerSet: peers.find((peer) => peer.companyId === id)?.peers ?? []
    });
  },
  setFilters: (partial) => {
    const current = get();
    const nextFilters = { ...current.filters, ...partial };
    const changed = (Object.keys(nextFilters) as Array<keyof PeerFilters>).some(
      (key) => current.filters[key] !== nextFilters[key]
    );
    if (!changed) {
      return;
    }
    set({ filters: nextFilters });
  },
  setPeerSet: (newPeers) => {
    const current = get();
    const sameLength = current.peerSet.length === newPeers.length;
    const sameOrder = sameLength && current.peerSet.every((peer, index) => peer === newPeers[index]);
    if (sameLength && sameOrder) {
      return;
    }
    set({ peerSet: newPeers });
  }
}));
