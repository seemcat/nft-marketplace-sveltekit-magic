import cookie from 'cookie';
import { getSession, SESSION_NAME } from './routes/api/_utils';

export const handle = async ({ request, resolve }) => {
	const cookies = cookie.parse(request.headers.cookie || '');
	const user = await getSession(cookies[SESSION_NAME]);

	request.locals.user = user;
	request.locals.userid = user?.publicAddress;

	if (request.query.has('_method')) {
		request.method = request.query.get('_method').toUpperCase();
	}

	const response = await resolve(request);

	return response;
};
