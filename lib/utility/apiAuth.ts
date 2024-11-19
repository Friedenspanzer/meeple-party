import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
type ApiHandlerWithUser = (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => Promise<void>;

export function withUser(handler: ApiHandlerWithUser): ApiHandler {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      res.status(401).send({});
      return;
    }
    return await handler(req, res, session.user);
  };
}
