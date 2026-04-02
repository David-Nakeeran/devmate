import fs from "node:fs/promises";
import { type } from "node:os";
import path from "node:path";

export async function readFile({ path: filePath, workspace }) {
  try {
    const fullPath = path.resolve(workspace, filePath);
    console.log(fullPath);

    if (!fullPath.startsWith(workspace)) {
      throw new Error("Path escapes workspace");
    }

    const data = await fs.readFile(fullPath, { encoding: "utf8" });

    return {
      path: fullPath,
      content: data,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function listFiles({ workspace }) {
  const fileNames = await fs.readdir(workspace, {
    withFileTypes: true,
    recursive: true,
  });

  const filtered = fileNames.filter((item) => {
    return !item.name.startsWith(".");
  });
  console.log(filtered);

  const folderMap = {};

  const filesDirectory = filtered.reduce((acc, item) => {
    if (item.isDirectory()) {
      folderMap[`${item.parentPath}/${item.name}`] = {
        name: item.name,
        type: item.isDirectory() ? "directory" : "file",
        children: [],
        path: `${item.parentPath}/${item.name}`,
      };
      acc.push(folderMap[`${item.parentPath}/${item.name}`]);
    } else {
      if (folderMap[item.parentPath]) {
        folderMap[item.parentPath].children.push({
          name: item.name,
          type: item.isDirectory() ? "directory" : "file",
          path: `${item.parentPath}/${item.name}`,
        });
      } else {
        const tree = {
          name: item.name,
          type: item.isDirectory() ? "directory" : "file",
          path: `${item.parentPath}/${item.name}`,
        };
        acc.push(tree);
      }
    }
    return acc;
  }, []);

  console.log(filesDirectory);
  return filesDirectory;
}
