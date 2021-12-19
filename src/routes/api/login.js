import { magicAdminSDK } from './_magic-admin';
import { createSessionCookie } from './_utils';

export async function post(req) {

  try {
    // Parse and validate the DID token
    const didToken = magicAdminSDK.utils.parseAuthorizationHeader(req.headers['authorization']);
    magicAdminSDK.token.validate(didToken);

    // Token is valid, so get the user metadata and set it in a cookie.
    const metadata = await magicAdminSDK.users.getMetadataByToken(didToken);
    console.log('User metadata: ', metadata);
    
    const cookie = await createSessionCookie(metadata);

    return {
      status: 200,
      headers: {
        'set-cookie': cookie,
      },
      body: {
        user: metadata
      },
    };
  } catch (err) {
    return {
      status: 500,
      body: {
        error: {
          message: 'Internal Server Error',
        },
      },
    };
  }
}