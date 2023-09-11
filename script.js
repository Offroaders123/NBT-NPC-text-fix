import * as fs from "node:fs/promises";
import * as NBT from "nbtify";

/**
 * @typedef { import("./entity.d.ts").Entity } Entity
 * @typedef { import("./entity.d.ts").Action } Action
*/

const inputData = await fs.readFile("./input.snbt",{ encoding: "utf-8" });

/** @type { Entity } */ // @ts-expect-error
const nbt = NBT.parse(inputData);

formatActions(nbt);

// @ts-expect-error
const outputData = NBT.stringify(nbt);

await fs.writeFile("./output.snbt",outputData,{ encoding: "utf-8" });
console.info("The NBT has been written to 'output.snbt'.");

/**
 * @param { Entity } entity
 * @returns { void }
*/
function formatActions(entity){
  for (const occupant of entity.tag.movingEntity.Occupants){
    const { Actions, Trident } = occupant.SaveData;

    if (Trident !== undefined){
      formatActions(Trident);
    }

    if (Actions === undefined) continue;

    /** @type { Action[] } */
    const actions = JSON.parse(Actions);

    for (const action of actions){
      const text = action.data.map(data => data.cmd_line).join("\n");
      action.text = text;
    }

    occupant.SaveData.Actions = JSON.stringify(actions);
  }
}