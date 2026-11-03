import { OAuth2Client } from "google-auth-library";



export async function verifyGoogleAccount(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
      idToken, // استقبال المتغير بشكل مباشر
      audience: '157637174604-tnhhobo63r5a7532iisrbp96ad4bpshn.apps.googleusercontent.com',
  });
  const payload = ticket.getPayload();
  return payload;
}