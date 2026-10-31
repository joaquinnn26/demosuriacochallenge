import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { activities as seedActivities, type Activity } from "@/data/activities";
import { isPublicActivity } from "@/lib/activityUtils";
import { hasGitHubStore, readGitHubFile, writeGitHubFile } from "@/lib/githubStore";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "admin-activities.json");
const repositoryDataFile = "data/admin-activities.json";

function parseActivities(raw: string): Activity[] | null {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Activity[] : null;
  } catch {
    return null;
  }
}

async function readLocalActivities() {
  try {
    return parseActivities(await readFile(dataFile, "utf8")) ?? seedActivities;
  } catch {
    return seedActivities;
  }
}

export async function readActivitiesFromStore(): Promise<Activity[]> {
  if (hasGitHubStore()) {
    try {
      const file = await readGitHubFile(repositoryDataFile);
      if (file) return parseActivities(file.toString("utf8")) ?? readLocalActivities();
    } catch (error) {
      console.error("GitHub activities read failed; using local copy:", error);
    }
  }
  return readLocalActivities();
}

export async function readPublicActivitiesFromStore() {
  return (await readActivitiesFromStore()).filter(isPublicActivity);
}

export async function writeActivitiesToStore(activities: Activity[]) {
  const content = Buffer.from(`${JSON.stringify(activities, null, 2)}\n`, "utf8");
  if (hasGitHubStore()) {
    await writeGitHubFile(repositoryDataFile, content, "Actualizar agenda desde el panel admin");
    return;
  }
  if (process.env.NODE_ENV === "production") throw new Error("GitHub no está configurado para guardar la agenda.");
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, content);
}

export async function getActivityBySlugFromStore(slug: string) {
  return (await readActivitiesFromStore()).find((activity) => activity.slug === slug);
}
