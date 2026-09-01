import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { validateAdminSessionCookie, validateSupabaseAdminUser } from "@/lib/adminAuth";
import { createSupabaseAdminClient, hasSupabaseBrowserEnv, hasSupabaseServerEnv } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const bucketName = "activity-images";
const maxImages = 3;
const maxImageSize = 5 * 1024 * 1024;

async function validateAdminRequest(request: Request) {
  if (!hasSupabaseBrowserEnv() || !hasSupabaseServerEnv()) return null;

  const auth = await validateSupabaseAdminUser(request);
  if (auth.error) return auth.error;
  if (!auth.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  return validateAdminSessionCookie(request, auth.user);
}

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;

  const fromType = file.type.split("/").pop()?.toLowerCase();
  return fromType && /^[a-z0-9]+$/.test(fromType) ? fromType : "jpg";
}

async function ensureBucket() {
  const supabase = createSupabaseAdminClient();
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) throw new Error(listError.message);
  if (buckets?.some((bucket) => bucket.name === bucketName)) return supabase;

  const { error } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: maxImageSize,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"]
  });

  if (error) throw new Error(error.message);
  return supabase;
}

export async function POST(request: Request) {
  try {
    if (!hasSupabaseServerEnv()) {
      return NextResponse.json({ error: "Supabase Storage no está configurado." }, { status: 503 });
    }

    const authError = await validateAdminRequest(request);
    if (authError) return authError;

    const formData = await request.formData();
    const files = formData.getAll("images").filter((value): value is File => value instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "No se recibieron imágenes." }, { status: 400 });
    }

    if (files.length > maxImages) {
      return NextResponse.json({ error: "Máximo 3 imágenes por actividad." }, { status: 400 });
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/") || file.size > maxImageSize);
    if (invalidFile) {
      return NextResponse.json({ error: "Cada archivo debe ser una imagen de hasta 5 MB." }, { status: 400 });
    }

    const supabase = await ensureBucket();
    const images: string[] = [];

    for (const file of files) {
      const extension = getExtension(file);
      const filePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

      if (error) throw new Error(error.message);

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      images.push(data.publicUrl);
    }

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: "No se pudieron subir las imágenes." }, { status: 500 });
  }
}
