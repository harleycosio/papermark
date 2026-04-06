import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { CustomUser } from "@/lib/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).send("Debes iniciar sesión primero.");
  }

  const user = session.user as CustomUser;
  const userEmail = user.email?.toLowerCase().trim();
  
  // Revisamos ambos nombres posibles de la variable para mayor seguridad
  const AUTHORIZED_EMAILS_RAW = process.env.AUTHORIZED_EMAILS || process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS || "";
  const authorizedList = AUTHORIZED_EMAILS_RAW.split(",").map(e => e.trim().toLowerCase());
  
  const isAuthorized = userEmail && authorizedList.includes(userEmail);

  if (!isAuthorized) {
    console.log(`[Admin] Acceso denegado para: ${userEmail}. Lista permitida:`, authorizedList);
    return res.status(403).send(`Tu correo (${userEmail}) no coincide con los autorizados en Vercel.`);
  }

  try {
    // 1. Elevamos el rango en todos los equipos donde esté el usuario
    await prisma.userTeam.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        role: "ADMIN",
      },
    });

    // 2. Nos aseguramos de que el plan de usuario sea premium
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        plan: "datarooms-premium",
      },
    });

    // Redirigimos al dashboard con éxito
    return res.redirect("/?promoted=true");
  } catch (error) {
    console.error("Error al promover usuario:", error);
    return res.status(500).send("Error interno al intentar elevar el rango.");
  }
}
