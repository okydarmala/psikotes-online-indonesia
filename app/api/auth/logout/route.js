import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  
  response.cookies.set('token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  return response;
}
