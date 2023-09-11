import * as fs from "node:fs/promises";
import * as NBT from "nbtify";

import type { Entity, Action } from "./entity.js";

const inputData = await fs.readFile("./input.txt",{ encoding: "utf-8" });
const nbt = NBT.parse(inputData) as unknown as Entity;

formatActions(nbt);

const outputData = NBT.stringify(nbt as unknown as NBT.RootTag);

await fs.writeFile("./output.txt",outputData,{ encoding: "utf-8" });
console.info("The NBT has been written to 'output.txt'.");

function formatActions(entity: Entity): void {
  for (const occupant of entity.tag.movingEntity.Occupants){
    const { Actions, Trident } = occupant.SaveData;

    if (Trident !== undefined){
      formatActions(Trident);
    }

    if (Actions === undefined) continue;
    const actions = JSON.parse(Actions) as Action[];

    for (const action of actions){
      const text = action.data.map(data => data.cmd_line).join("\n");
      action.text = text;
    }

    occupant.SaveData.Actions = JSON.stringify(actions,null,2);
  }
}