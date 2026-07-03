function withProtocol(url: string) {
  const cleanUrl = url.replace(/\/$/, "");

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `https://${cleanUrl}`;
}

export const siteUrl = withProtocol(
  process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "sindh-automotive-dealers.vercel.app"
);

export const shareImage = {
  url: `${siteUrl}/sindh-share-preview-v3.jpg?v=20260703`,
  width: 1200,
  height: 630,
  alt: "Sindh Automotive Dealers logo",
  type: "image/jpeg"
};
