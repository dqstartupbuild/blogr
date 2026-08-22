import { base64UrlEncode } from "./base64UrlEncode";
import { decodePemPrivateKey } from "./decodePemPrivateKey";

const tokenUrl = "https://oauth2.googleapis.com/token";
const cloudPlatformScope = "https://www.googleapis.com/auth/cloud-platform";

type CreateGoogleCloudRunJwtOptions = {
  clientEmail: string;
  privateKey: string;
};

export const createGoogleCloudRunJwt = async ({
  clientEmail,
  privateKey,
}: CreateGoogleCloudRunJwtOptions) => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const unsignedJwt = `${base64UrlEncode(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  )}.${base64UrlEncode(
    JSON.stringify({
      aud: tokenUrl,
      exp: nowSeconds + 3600,
      iat: nowSeconds,
      iss: clientEmail,
      scope: cloudPlatformScope,
    }),
  )}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    decodePemPrivateKey(privateKey),
    {
      hash: "SHA-256",
      name: "RSASSA-PKCS1-v1_5",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedJwt),
  );

  return `${unsignedJwt}.${base64UrlEncode(signature)}`;
};
