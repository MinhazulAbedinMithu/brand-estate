import { type NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import { Property, IProperty } from '@/lib/db/models/property.model';

// ─────────────────────────────────────────────
// GET /api/properties/map (Geo BBox Search)
// ─────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const neLat = searchParams.get('neLat');
    const neLng = searchParams.get('neLng');
    const swLat = searchParams.get('swLat');
    const swLng = searchParams.get('swLng');

    const filter: Record<string, unknown> = { status: 'active' };

    if (neLat && neLng && swLat && swLng) {
      const nLat = parseFloat(neLat);
      const nLng = parseFloat(neLng);
      const sLat = parseFloat(swLat);
      const sLng = parseFloat(swLng);

      filter['_geo.lat'] = { $gte: sLat, $lte: nLat };

      // Handle antimeridian wrap-around if swLng > neLng
      if (sLng <= nLng) {
        filter['_geo.lng'] = { $gte: sLng, $lte: nLng };
      } else {
        filter.$or = [
          { '_geo.lng': { $gte: sLng } },
          { '_geo.lng': { $lte: nLng } },
        ];
      }
    }

    const properties = await Property.find(filter)
      .select('title _geo price transactionType propertyCategory currency')
      .lean();

    const sanitizedData = (properties as IProperty[]).map((p) => ({
      id: p._id.toString(),
      title: p.title,
      _geo: p._geo,
      price: p.price,
      currency: p.currency || 'USD',
      transactionType: p.transactionType,
      propertyCategory: p.propertyCategory,
    }));

    return NextResponse.json({
      status: 'success',
      count: sanitizedData.length,
      data: sanitizedData,
    });
  } catch (err: unknown) {
    console.error('[GET /api/properties/map]', err);
    return NextResponse.json(
      { status: 'error', error: 'InternalServerError', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
