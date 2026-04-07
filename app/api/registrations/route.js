import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export async function GET() {
    try {
        const registrationsRef = collection(db, "registrations");
        // Order by timestamp descending just like the old SQLite query
        const q = query(registrationsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        const rows = [];
        querySnapshot.forEach((doc) => {
            // Push the data and its unique Firestore ID
            rows.push({ id: doc.id, ...doc.data() });
        });

        return NextResponse.json(rows);
    } catch (err) {
        console.error("Error fetching data from Firebase:", err.message);
        return NextResponse.json(
            { error: "Failed to retrieve records." },
            { status: 500 }
        );
    }
}
