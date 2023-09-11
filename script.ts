import * as fs from 'node:fs/promises';
import * as nbt from 'nbtify';

import type { Entity, Action } from './entity.js';

const inputData = await fs.readFile('input.txt', 'utf8');

const regex = /\\\"button_name\\\":\\\"([^,]*?)\\\",(\\\"data\\\":\[.*?\]),\\\"mode\\\"[ ]*:[ ]*(.*?),\\\"text\\\":\\\"(.*?)\\\"/g;

const outputData = inputData.replace(regex, (_match, buttonName, data, mode, _text) => {
  const commands = data.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",(\\\"cmd_ver\\\":|$)/g);
  const commandLines = commands.map((cmd: any) => {
    const cmdLine = cmd.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",/);
    return cmdLine ? cmdLine[1].replace(/\\\\"/g, '\\\\\"') : '';
  });
  const joinedCommands = commandLines.join('\\\\n');
  return `\\\"button_name\\\":\\\"${buttonName}\\\",${data},\\\"mode\\\":${mode},\\\"text\\\":\\\"${joinedCommands}\\\"`;
});

const outputObject = nbt.parse(outputData) as unknown as Entity;
formatActions(outputObject);
// console.log(outputObject,"\n");

await fs.writeFile('output.txt', nbt.stringify(outputObject as unknown as nbt.RootTag), 'utf8');

console.info("The NBT has been written to output.txt.");

function formatActions(inputData: Entity){
  const { Occupants } = inputData.tag.movingEntity;
  for (const occupant of Occupants){
    if (occupant.SaveData.Trident) formatActions(occupant.SaveData.Trident);
    let { Actions } = occupant.SaveData;
    if (Actions === undefined) continue;
    const actions = JSON.parse(Actions) as Action[];
    Actions = JSON.stringify(actions,null,2);
    console.log(actions);
    // console.log(actions.map(action => action.data.map(data => data.cmd_line)));
    occupant.SaveData.Actions = Actions;
  }
}

function gg(inputData: any){
  const actionString: string = inputData.tag.movingEntity.Occupants
    .map((occupant: any) => occupant.SaveData.Actions)
    .filter(Boolean);
  const actions: Record<string, any>[] = JSON.parse(actionString);
  return actions;
}