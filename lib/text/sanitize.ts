export function stripMarkdownNoise(input?: string) {
  if (!input) return "";
  return input.replace(/\*\*/g, "").replace(/^###\s*/gm, "").trim();
}
