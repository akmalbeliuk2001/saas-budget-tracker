import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check user based on email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return Response.json({ error: "Email not found" }, { status: 404 });

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return Response.json({ error: "Wrong password" }, { status: 401 });

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return Response.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "A server error occurred" }, { status: 500 });
  }
}
