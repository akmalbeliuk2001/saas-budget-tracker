import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Token tidak ditemukan" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    return Response.json({ error: "Token tidak valid" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId as string },
    select: { id: true, email: true, name: true, isPro: true, createdAt: true },
  });

  return Response.json(user);
}
