import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  // 1️⃣ Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // 2️⃣ Verification token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  // 3️⃣ Get data body request
  const { name, color } = await req.json();
  if (!name || !color) {
    return Response.json(
      { error: "Category name and color are required" },
      { status: 400 }
    );
  }

  // 4️⃣ Save to database
  const category = await prisma.category.create({
    data: {
      name,
      color,
      userId: decoded.userId as string,
    },
  });

  // 5️⃣ Send success response
  return Response.json({ message: "Category created successfully", category });
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    return Response.json({ error: "Token not valid" }, { status: 401 });
  }

  // Get user's category
  const categories = await prisma.category.findMany({
    where: { userId: decoded.userId as string },
    include: { transactions: true }, // Take a relationship at the same time
    orderBy: { name: "asc" },
  });

  return Response.json(categories);
}
