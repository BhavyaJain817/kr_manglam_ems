import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');

export async function GET() {
    try {
        const db = getDb();
        const rows = db.prepare(`SELECT * FROM registrations ORDER BY timestamp DESC`).all();
        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error fetching data:", err.message);
        return NextResponse.json(
            { error: "Failed to retrieve records." },
            { status: 500 }
        );
    }
}
