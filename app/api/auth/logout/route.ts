import { NextResponse } from 'next/server';

const COOKIE_NAME = 'be_auth_token';

export async function POST() {
  const response = NextResponse.json(
    { status: 'success', message: 'Logged out successfully.' },
    { status: 200 }
  );

  // Clear the auth cookie by setting maxAge to 0
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
