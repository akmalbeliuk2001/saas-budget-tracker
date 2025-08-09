import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// 🔹 UPDATE TRANSACTION
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Checking beared token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Token not found" }, { status: 401 });
  }

  // Decoded token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  const { categoryId, amount, note, date } = await req.json();

  const updated = await prisma.transaction.updateMany({
    where: {
      id: params.id,
      userId: decoded.userId as string,
    },
    data: {
      categoryId,
      amount,
      note: note || null,
      date: date ? new Date(date) : undefined,
    },
  });

  if (updated.count === 0)
    return Response.json({ error: "Transaction not found" }, { status: 404 });

  return Response.json({ message: "Transaction succesfully updated" });
}

// 🔹 DELETE TRANSACTION
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Checking bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // Decoded token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  const deleted = await prisma.transaction.deleteMany({
    where: {
      id: params.id,
      userId: decoded.userId as string,
    },
  });

  if (deleted.count === 0)
    return Response.json({ error: "Transaction not found" }, { status: 404 });

  return Response.json({ message: "Transaction succesfully deleted" });
}
