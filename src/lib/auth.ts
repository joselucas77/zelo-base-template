import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/jwt-auth";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const payload = await verifyJwtToken(token);
  if (!payload?.sub) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        tenant: true,
        accessGroup: true,
      },
    });

    if (
      !user ||
      !user.active ||
      user.deletedAt !== null ||
      !user.tenant ||
      !user.tenant.active ||
      user.tenant.deletedAt !== null
    ) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Erro ao validar sessão do usuário no banco:", error);
    return null;
  }
}
