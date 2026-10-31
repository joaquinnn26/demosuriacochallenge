import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/adminAuth";
import { getPublicGitHubUrl, hasGitHubStore, writeGitHubFile } from "@/lib/githubStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const maxImages = 3;
const maxImageSize = 5 * 1024 * 1024;

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^(jpe?g|png|webp|gif)$/.test(extension) ? extension : "jpg";
}

export async function POST(request: Request) {
  try {
    const authError = validateAdminSession(request);
    if (authError) return authError;
    if (!hasGitHubStore()) return NextResponse.json({ error: "GitHub no está configurado." }, { status: 503 });
    const formData = await request.formData();
    const files = formData.getAll("images").filter((value): value is File => value instanceof File);
    if (!files.length) return NextResponse.json({ error: "No se recibieron imágenes." }, { status: 400 });
    if (files.length > maxImages) return NextResponse.json({ error: "Máximo 3 imágenes por actividad." }, { status: 400 });
    if (files.some((file) => !file.type.startsWith("image/") || file.size > maxImageSize)) return NextResponse.json({ error: "Cada archivo debe ser una imagen de hasta 5 MB." }, { status: 400 });

    const images: string[] = [];
    for (const file of files) {
      const filePath = `public/uploads/activities/${new Date().toISOString().slice(0, 10)}-${randomUUID()}.${getExtension(file)}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeGitHubFile(filePath, buffer, `Subir imagen ${file.name}`);
      if (process.env.NODE_ENV !== "production") {
        const localPath = path.join(process.cwd(), filePath);
        await mkdir(path.dirname(localPath), { recursive: true });
        await writeFile(localPath, buffer);
      }
      images.push(getPublicGitHubUrl(filePath));
    }
    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron subir las imágenes.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
