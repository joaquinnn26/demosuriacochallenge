import type { ActivityDifficulty } from "@/data/activities";

const styles: Record<ActivityDifficulty, string> = {
  Fácil: "bg-moss/20 text-pine",
  Media: "bg-ember/18 text-ember",
  Difícil: "bg-carbon text-fog"
};

export function DifficultyBadge({ difficulty }: { difficulty: ActivityDifficulty }) {
  return (
    <span className={`inline-flex rounded-sm px-3 py-1 text-xs font-black uppercase tracking-wide ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}
