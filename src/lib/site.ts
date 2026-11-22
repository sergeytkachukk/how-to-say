// The public address of the site. Set NEXT_PUBLIC_SITE_URL when you deploy.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "How to say";
