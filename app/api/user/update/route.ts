// app/api/user/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const userId = (session.user as any).id;

    console.log(`[user-update] Attempting to update user: ${userId} to name: ${name}`);

    // Try updating by string ID first (common in NextAuth MongoDB adapter)
    let result = await db.collection("users").updateOne(
      { _id: userId as any },
      { $set: { name } }
    );

    // If not found, try as ObjectId
    if (result.matchedCount === 0 && ObjectId.isValid(userId)) {
      result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name } }
      );
    }

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, name });
  } catch (err) {
    console.error("[user-update] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
