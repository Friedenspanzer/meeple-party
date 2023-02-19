import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextRequest } from 'next/server';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: '/(^(?!\/api\/auth)\/api.*$)' //API but not the auth api
};