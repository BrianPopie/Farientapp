import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile, access } from "fs/promises";
import { constants } from "fs";
import path from "path";
import crypto from "crypto";
import type { UploadedFiling } from "@/lib/types";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const META_FILE = path.join(UPLOAD_DIR, "uploads.json");
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await access(META_FILE, constants.F_OK);
  } catch {
    await writeFile(META_FILE, JSON.stringify([], null, 2));
  }
}

async function readMetadata(): Promise<UploadedFiling[]> {
  try {
    const data = await readFile(META_FILE, "utf-8");
    const parsed = JSON.parse(data) as UploadedFiling[];
    return parsed;
  } catch {
    return [];
  }
}

async function persistMetadata(files: UploadedFiling[]) {
  await writeFile(META_FILE, JSON.stringify(files, null, 2));
}

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function GET() {
  await ensureUploadDir();
  const files = await readMetadata();
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  await ensureUploadDir();
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Missing PDF file" }, { status: 400 });
  }

  const pdf = file as Blob & { name?: string; type?: string };
  const providedName = pdf.name ?? "upload.pdf";
  const fileName = sanitizeName(providedName);
  const mimeType = pdf.type ?? "application/octet-stream";

  if (mimeType !== "application/pdf" && !fileName.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "Only PDF uploads are supported" }, { status: 415 });
  }

  const buffer = Buffer.from(await pdf.arrayBuffer());
  if (buffer.length === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (buffer.length > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "PDF exceeds 25MB limit" }, { status: 413 });
  }

  const storedName = `${Date.now()}-${crypto.randomUUID()}-${fileName}`;
  const destination = path.join(UPLOAD_DIR, storedName);
  await writeFile(destination, buffer);

  const uploadedAt = new Date().toISOString();
  const entry: UploadedFiling = {
    id: storedName,
    name: providedName,
    size: buffer.length,
    uploadedAt
  };

  const existing = await readMetadata();
  existing.unshift(entry);
  await persistMetadata(existing);

  return NextResponse.json({ file: entry });
}
