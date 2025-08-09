import { prisma } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// 🔹 UPDATE CATEGORY
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Checking bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // Decoded bearer token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  const { name, color } = await req.json();
  if (!name && !color) {
    return Response.json(
      { error: "At least one field (name or color) must be filled in." },
      { status: 400 }
    );
  }

  // Update category
  const updatedCategory = await prisma.category.updateMany({
    where: {
      id: params.id,
      userId: decoded.userId as string,
    },
    data: {
      ...(name && { name }),
      ...(color && { color }),
    },
  });

  if (updatedCategory.count === 0) {
    return Response.json(
      { error: "Category not found or no access available" },
      { status: 404 }
    );
  }

  return Response.json({ message: "Category successfully updated" });
}

// 🔹 DELETE CATEGORY
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Checking bearer token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer "))
    return Response.json({ error: "Token not found" }, { status: 401 });

  // Decoded bearer token
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded !== "object" || !("userId" in decoded))
    return Response.json({ error: "Token not valid" }, { status: 401 });

  // Delete category
  const deletedCategory = await prisma.category.deleteMany({
    where: {
      id: params.id,
      userId: decoded.userId as string,
    },
  });

  if (deletedCategory.count === 0) {
    return Response.json(
      { error: "Category not found or no access available" },
      { status: 404 }
    );
  }

  return Response.json({ message: "Category successfully deleted" });
}
