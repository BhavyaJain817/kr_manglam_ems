import { NextResponse } from 'next/server';
const { getDb } = require('@/lib/db');

// Helper function to generate unique ID
function generateTeamId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'KRMU-';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, track, members } = body;

        if (!name || !email || !phone || !track) {
            return NextResponse.json(
                { error: "All required fields must be filled." },
                { status: 400 }
            );
        }

        // Verify email domain
        if (!email.toLowerCase().endsWith('@krmu.edu.in')) {
            return NextResponse.json(
                { error: "Only @krmu.edu.in emails are allowed." },
                { status: 400 }
            );
        }

        // Verify dynamic member email domains
        if (members && Array.isArray(members)) {
            for (let mem of members) {
                if (!mem.email || !mem.email.toLowerCase().endsWith('@krmu.edu.in')) {
                    return NextResponse.json(
                        { error: `Team member '${mem.name}' must also use an @krmu.edu.in email address.` },
                        { status: 400 }
                    );
                }
            }
        }

        const teamId = generateTeamId();
        const membersJSON = members ? JSON.stringify(members) : "[]";

        const db = getDb();
        const stmt = db.prepare(
            `INSERT INTO registrations (teamId, name, email, phone, track, membersJSON) VALUES (?, ?, ?, ?, ?, ?)`
        );
        stmt.run(teamId, name, email, phone, track, membersJSON);

        console.log(`New registration added with Team ID: ${teamId}`);
        return NextResponse.json(
            { message: "Registration successful!", teamId: teamId },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error inserting data:", err.message);
        return NextResponse.json(
            { error: "Failed to save to database." },
            { status: 500 }
        );
    }
}
