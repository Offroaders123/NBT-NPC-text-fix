import * as fs from "node:fs/promises";
import * as NBT from "nbtify";

const INPUT_SRC = "./input.txt";
const OUTPUT_SRC = "./output.txt";

const inputText = await fs.readFile(INPUT_SRC,{ encoding: "utf-8" });
const inputNBT = NBT.parse(inputText);

const outputNBT = formatActions(inputNBT);
const outputText = NBT.stringify(outputNBT);

await fs.writeFile(OUTPUT_SRC,outputText);

/**
 * @param { NBT.RootTag } inputNBT
*/
function formatActions(inputNBT){
  const outputNBT = /** @type { any } */ (inputNBT);

  for (const occupant of outputNBT.tag.movingEntity.Occupants){
    if (occupant.SaveData.Trident !== undefined){
      formatActions(occupant.SaveData.Trident);
    }

    if (occupant.SaveData.Actions === undefined) continue;

    const outputActions = JSON.parse(occupant.SaveData.Actions);
    console.log(occupant.SaveData.Actions);

    for (const action of outputActions){
      const outputText = action.data
        .map((/** @type { any } */ data) => data.cmd_line)
        .join("\n");
      // console.log(outputText,"\n");

      action.text = outputText;
    }

    occupant.SaveData.Actions = JSON.stringify(outputActions,null,2);

    console.log(occupant.SaveData.Actions);
  }

  return /** @type { NBT.RootTag } */ (outputNBT);
}