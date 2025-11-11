import fs from "node:fs";
import path from "node:path";

export function md(section: string, fallback: string) {
  try {
    const target = path.join(process.cwd(), "docs", `${section}.md`);
    const contents = fs.readFileSync(target, "utf8").trim();
    return contents.length ? contents : fallback;
  } catch {
    return fallback;
  }
}
