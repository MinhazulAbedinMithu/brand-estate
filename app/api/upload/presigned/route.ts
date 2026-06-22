import { type NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyEdgeJwt } from '@/lib/auth/edge-jwt';

const COOKIE_NAME = 'be_auth_token';
const JWT_SECRET = process.env.JWT_SECRET || '';

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    // ── 1. Authenticate user from session cookie ──────────────
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const payload = await verifyEdgeJwt(token, JWT_SECRET);
    if (!payload) {
      return NextResponse.json(
        { status: 'error', error: 'Unauthorized', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    // ── 2. Parse and validate request inputs ───────────────────
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { status: 'error', error: 'InvalidBody', message: 'Request body must be valid JSON.' },
        { status: 400 }
      );
    }

    const { filename, contentType, folder = 'general' } = body as {
      filename?: string;
      contentType?: string;
      folder?: string;
    };

    if (!filename || typeof filename !== 'string' || !contentType || typeof contentType !== 'string') {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'filename and contentType are required fields.',
        },
        { status: 400 }
      );
    }

    // Basic MIME type validation
    const allowedMimePrefixes = ['image/', 'video/', 'application/pdf'];
    const isValidMime = allowedMimePrefixes.some((prefix) => contentType.startsWith(prefix));
    if (!isValidMime) {
      return NextResponse.json(
        {
          status: 'error',
          error: 'ValidationError',
          message: 'Only image, video, and PDF file types are supported.',
        },
        { status: 400 }
      );
    }

    // ── 3. Build unique file key and bucket parameters ─────────
    // Sanitize filename: replace spaces and special characters
    const sanitizedFilename = filename
      .replace(/[^a-zA-Z0-9.\-_]/g, '_')
      .toLowerCase();
    
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_\-]/g, '').toLowerCase();
    const key = `${sanitizedFolder}/${uniquePrefix}-${sanitizedFilename}`;

    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';

    // Create S3 command for putting the object
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });

    // ── 4. Generate presigned URL ─────────────────────────────
    // Expire URL in 5 minutes (300 seconds)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // Compute public CDN/R2 read URL
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
    const publicUrl = `${publicUrlBase.replace(/\/$/, '')}/${key}`;

    return NextResponse.json(
      {
        status: 'success',
        key,
        uploadUrl,
        publicUrl,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[POST /api/upload/presigned]', err);
    return NextResponse.json(
      {
        status: 'error',
        error: 'InternalServerError',
        message: 'An unexpected error occurred generating the upload URL.',
      },
      { status: 500 }
    );
  }
}
