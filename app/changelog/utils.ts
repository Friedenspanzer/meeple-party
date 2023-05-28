import path from "path";
import fs from "fs";
import matter from "gray-matter";

const updatesDirectory = path.join(
  process.cwd(),
  "app",
  "changelog",
  "updates"
);

function getUpdateFiles() {
  return fs.readdirSync(updatesDirectory);
}

export interface Update {
  title: string;
  date: string;
  image?: string;
  excerpt: string;
  slug: string;
  content: string;
}

export function getUpdateMetadata(): Update[] {
  const files = getUpdateFiles();

  if (!files) return [];

  const postLists: Update[] = files.map((f) => parseFile(f));

  return postLists;
}

export function parseFile(file: string): Update {
  const filePath = path.join(updatesDirectory, file);
  const fileContent = fs.readFileSync(filePath, "utf8");

  const { data, content } = matter(fileContent);

  return {
    title: "",
    date: "",
    excerpt: "",
    slug: file.replace(".md", ""),
    ...data,
    content,
  };
}
