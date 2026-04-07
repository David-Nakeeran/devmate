import fs from "node:fs/promises";
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
  // console.log(filtered);

  const referenceObject = {};
  const fileDirectory = [];

  filtered.forEach((item) => {
    const fullPath = `${item.parentPath}/${item.name}`;

    referenceObject[fullPath] = {
      name: item.name,
      type: item.isDirectory() ? "directory" : "file",
      path: fullPath,
      children: item.isDirectory() ? [] : null,
    };
  });

  filtered.forEach((item) => {
    const fullPath = `${item.parentPath}/${item.name}`;
    const node = referenceObject[fullPath];

    const parent = referenceObject[item.parentPath];

    if (parent) {
      parent.children.push(node);
    } else {
      fileDirectory.push(node);
    }
  });

  console.log(fileDirectory);
  return fileDirectory;
}

export async function editFile(args) {
  const { path: filePath, workspace, operation, target, content } = args;
  let newContent;

  if (content === null) {
    throw new Error("No content provided");
  }

  if (target === null) {
    throw new Error("No target provided");
  }

  try {
    // TODO change into reusable function
    const fullPath = path.resolve(workspace, filePath);
    console.log(fullPath);

    if (!fullPath.startsWith(workspace)) {
      throw new Error("Path escapes workspace");
    }

    const data = await fs.readFile(fullPath, { encoding: "utf8" });

    switch (operation) {
      case "replace":
        newContent = data.replace(target, content);
        break;
      case "delete":
        newContent = data.replace(target, "");
        break;
      case "insert":
        console.log("To do");
        break;
    }

    await fs.writeFile(fullPath, newContent);
  } catch (error) {
    throw new Error(error.message);
  }
}
