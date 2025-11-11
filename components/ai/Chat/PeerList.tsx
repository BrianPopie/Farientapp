"use client";

const PEERS = [
  { name: "ArcLight Industrial", ticker: "ARCI", mix: "55/20/25", note: "Ops-heavy, EBITDA focus" },
  { name: "Northwind Energy", ticker: "NWE", mix: "50/25/25", note: "High leverage, P&L ownership critical" },
  { name: "Helios Consumer", ticker: "HCS", mix: "45/30/25", note: "Growth tilt, equity refresh pending" }
];

export default function PeerList() {
  return (
    <section className="card space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Peer set</p>
        <span className="text-xs text-slate-400">Mock data</span>
      </div>
      <ul className="space-y-2 text-sm">
        {PEERS.map((peer) => (
          <li key={peer.ticker} className="rounded-xl border border-border bg-card/70 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-100">{peer.name}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{peer.ticker}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Mix {peer.mix}</span>
              <span>{peer.note}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
