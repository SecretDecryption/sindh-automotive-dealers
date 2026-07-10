import { dealer } from "@/lib/dealer";

export function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 shadow-card dark:border-white/10">
      <iframe
        title="Sindh Automotive Dealers map"
        src={dealer.mapEmbedUrl}
        className="h-[360px] w-full"
        loading="lazy"
      />
    </div>
  );
}
