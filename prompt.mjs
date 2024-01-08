import inquirer from "inquirer";
import { promises as fs } from "fs";
import path from "path";

async function selectFile() {
  const currentDir = process.cwd();

  try {
    const files = await fs.readdir(currentDir);

    const statsPromises = files.map((file) =>
      fs.lstat(path.join(currentDir, file))
    );
    const stats = await Promise.all(statsPromises);

    const fileList = files.filter((file, index) => stats[index].isFile());

    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "selectedFile",
        message: "Select a file:",
        choices: fileList,
      },
    ]);

    console.log(`You selected: ${answer.selectedFile}`);
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

selectFile();
