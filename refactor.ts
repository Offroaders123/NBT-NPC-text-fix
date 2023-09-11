import * as fs from "node:fs/promises";
import * as NBT from "nbtify";

import type { Entity, Action } from "./entity.js";

const INPUT_SRC = "./input.txt";
const OUTPUT_SRC = "./output.txt";

const inputText = await fs.readFile(INPUT_SRC,{ encoding: "utf-8" });
const inputNBT = NBT.parse(inputText) as unknown as Entity;

const outputNBT = formatActions(inputNBT);
const outputText = NBT.stringify(outputNBT as unknown as NBT.RootTag);

await fs.writeFile(OUTPUT_SRC,outputText);

function formatActions(inputNBT: Entity){
  const outputNBT = inputNBT;

  for (const occupant of outputNBT.tag.movingEntity.Occupants){
    if (occupant.SaveData.Trident !== undefined){
      formatActions(occupant.SaveData.Trident);
    }

    if (occupant.SaveData.Actions === undefined) continue;

    const outputActions = JSON.parse(occupant.SaveData.Actions) as Action[];
    // console.log(occupant.SaveData.Actions);

    for (const action of outputActions){
      const outputText = action.data
        .map(data => data.cmd_line)
        .join("\n");
      // console.log(outputText,"\n");
      console.log(action,"\n");

      action.text = outputText;
    }

    occupant.SaveData.Actions = JSON.stringify(outputActions,null,2);

    // console.log(occupant.SaveData.Actions);
  }

  return outputNBT;
}