type InfoCardProps = {
  label: string;
  value: string;
};

export function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-sm border border-carbon/10 bg-white/75 p-4">
      <dt className="text-xs font-black uppercase tracking-wide text-carbon/50">{label}</dt>
      <dd className="mt-2 text-base font-bold text-carbon">{value}</dd>
    </div>
  );
}
