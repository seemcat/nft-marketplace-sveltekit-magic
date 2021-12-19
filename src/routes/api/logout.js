import { magicAdminSDK } from './_magic-admin';
import { removeSessionCookie } from './_utils';

export async function get(req) {
  const cookie = removeSessionCookie();
  const data = req.locals.user;
  const issuer = data.issuer;

  try {
    await magicAdminSDK.users.logoutByIssuer(issuer);
  } catch (err) {
    console.log('Magic session already expired');
  }

  return {
    status: 200,
    headers: {
      'set-cookie': cookie,
    },
    body: {},
  };
}