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
      success: true,
      data: {
        path: fullPath,
        content: data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to read file",
    };
  }
}

export async function listFiles({ workspace }) {
  try {
    const fileNames = await fs.readdir(workspace, {
      withFileTypes: true,
      recursive: true,
    });

    const filtered = fileNames.filter((item) => {
      return !item.name.startsWith(".");
    });

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

    return {
      success: true,
      data: fileDirectory,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to list files",
    };
  }
}

export async function editFile(args) {
  const { path: filePath, workspace, operation, target, content } = args;

  try {
    // TODO change into reusable function
    const fullPath = path.resolve(workspace, filePath);
    console.log(fullPath);

    if (!fullPath.startsWith(workspace)) {
      throw new Error("Path escapes workspace");
    }

    const data = await fs.readFile(fullPath, { encoding: "utf8" });

    if (!operation) {
      return {
        success: false,
        error: "Operation is required",
      };
    }

    if (!target) {
      return {
        success: false,
        error: "Target is required",
      };
    }

    if (operation === "replace" && !content) {
      return {
        success: false,
        error: "Content required for replace",
      };
    }

    let newContent;
    switch (operation) {
      case "replace":
        if (!data.includes(target)) {
          return {
            success: false,
            error: "Target not found in file",
          };
        }
        newContent = data.replace(target, content);
        break;
      case "delete":
        if (!data.includes(target)) {
          return {
            success: false,
            error: "Target not found in file",
          };
        }
        newContent = data.replace(target, "");
        break;
      case "insert":
        const lines = data.split(/\r?\n/);
        const index = lines.indexOf(target);
        if (index === -1) {
          return {
            success: false,
            error: "Target not found in file",
          };
        }
        lines.splice(index + 1, 0, content);
        newContent = [...lines].join("\r\n");
        break;
      default:
        return { success: false, error: "Invalid operation" };
    }

    if (newContent === undefined) {
      return {
        success: false,
        error: "Edit failed to produce content",
      };
    }

    await fs.writeFile(fullPath, newContent);

    return {
      success: true,
      message: "File updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unexpected error",
    };
  }
}
