import { withUser } from "@/utility/apiAuth";
import { supabase } from "@/utility/supabase";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { prisma } from "@/db";

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg"];

export const config = {
  api: {
    bodyParser: false,
  },
};

const PROFILE_PICTURE_BASE_PATH = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/profilepictures/`;

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    if (req.method === "PUT") {
      const form = new formidable.IncomingForm({
        maxFields: 1,
        maxFiles: 1,
        maxFileSize: 1024 * 1024,
        maxFieldsSize: 1,
      });
      form.parse(req, async (err, _, files) => {
        try {
          if (err) {
            throw err;
          }
          const avatar = getSingleFile(files);
          const filename = await saveAvatar(avatar, user);
          await updateInDatabase(filename, user);
          await deleteOldFile(user);
          res.status(200).send({});
        } catch (e) {
          console.error(e);
          res.status(500).json({ success: false, error: e });
        }
      });
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
});

async function deleteOldFile(user: User) {
  const oldPath = getOldPath(user);
  if (oldPath) {
    const { error } = await supabase.storage
      .from("profilepictures")
      .remove([oldPath]);
    if (error) {
      throw error;
    }
  }
}

function getOldPath(user: User) {
  if (!user.image) {
    return null;
  }
  const matches = user.image.match("([^/]+$)");
  if (!matches) {
    throw Error(
      `Error reading old image name. There may be stale files in the storage. User id: ${user.id}`
    );
  }
  return `${user.id}/${matches[0]}`;
}

async function updateInDatabase(filename: string, user: User) {
  const fullPath = `${PROFILE_PICTURE_BASE_PATH}${filename}`;
  await prisma.user.update({
    where: { id: user.id },
    data: { image: fullPath },
  });
}

async function saveAvatar(avatar: formidable.File, user: User) {
  const avatarContent = await fs.promises.readFile(avatar.filepath);
  const filename = `${user.id}/${avatar.newFilename}`;
  const { data, error } = await supabase.storage
    .from("profilepictures")
    .upload(filename, avatarContent, {
      contentType: avatar.mimetype!,
    });
  if (error) {
    throw error;
  } else if (data) {
    return data.path;
  } else {
    throw Error("Unknown error when sending image data.");
  }
}

function getSingleFile(files: formidable.Files) {
  if (!files.avatar || Array.isArray(files.avatar)) {
    throw Error("File was passed in a wrong format.");
  }
  if (!ALLOWED_FILE_TYPES.includes(files.avatar.mimetype || "")) {
    throw Error("Mime type not allowed.");
  } else if (files.avatar.size > 1048576) {
    throw Error("File is too big.");
  }
  return files.avatar;
}
