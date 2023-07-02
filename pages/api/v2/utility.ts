import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { ApiError, ApiErrorMessage } from "./types";

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
      throw Error("Unauthorized");
    }
    return await handler(req, res, session.user);
  };
}

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (reason) {
      console.error("API error: ", reason);
      if (reason instanceof ApiError) {
        res
          .status(reason.code)
          .send({ reason: reason.message } as ApiErrorMessage);
      } else {
        res.status(500).send({ reason } as ApiErrorMessage);
      }
    }
  };
}
