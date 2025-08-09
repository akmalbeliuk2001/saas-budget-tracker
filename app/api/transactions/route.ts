import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// 🔹 GET ALL TRANSACTIONS (user-specific)
export async function GET(req: Request) {
  // Checking bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // Decoded bearer token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: decoded.userId as string,
    },
    include: {
      category: true, // So you can immediately get the name & color of the category
    },
    orderBy: {
      date: "desc",
    },
  });

  return Response.json(transactions);
}

// 🔹 CREATE TRANSACTION
export async function POST(req: Request) {
  // Checking bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // Decoded bearer token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  const { categoryId, amount, note, date } = await req.json();

  if (!categoryId || !amount || !date) {
    return Response.json(
      { error: "CategoryId, amount, and date are required" },
      { status: 400 }
    );
  }

  // Create transaction
  const newTransaction = await prisma.transaction.create({
    data: {
      categoryId,
      amount,
      note: note || null,
      date: new Date(date),
      userId: decoded.userId as string,
    },
  });

  return Response.json({
    message: "Transaction successfully created",
    transaction: newTransaction,
  });
}
