import * as fs from 'node:fs/promises';
import * as nbt from 'nbtify';

const inputData = await fs.readFile('input.txt', 'utf8');

const regex = /\\\"button_name\\\":\\\"([^,]*?)\\\",(\\\"data\\\":\[.*?\]),\\\"mode\\\"[ ]*:[ ]*(.*?),\\\"text\\\":\\\"(.*?)\\\"/g;

const outputData = inputData.replace(regex, (_match, buttonName, data, mode, _text) => {
  const commands = data.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",(\\\"cmd_ver\\\":|$)/g);
  const commandLines = commands.map(cmd => {
    const cmdLine = cmd.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",/);
    return cmdLine ? cmdLine[1].replace(/\\\\"/g, '\\\\\"') : '';
  });
  const joinedCommands = commandLines.join('\\\\n');
  return `\\\"button_name\\\":\\\"${buttonName}\\\",${data},\\\"mode\\\":${mode},\\\"text\\\":\\\"${joinedCommands}\\\"`;
});

const outputObject = nbt.parse(outputData);
formatActions(outputObject);
// console.log(outputObject,"\n");

await fs.writeFile('output.txt', nbt.stringify(outputObject), 'utf8');

console.info("The NBT has been written to output.txt.");

/**
 * @param { any } inputData
*/
function formatActions(inputData){
  const { Occupants } = inputData.tag.movingEntity;
  for (const occupant of Occupants){
    if (occupant.SaveData.Trident) formatActions(occupant.SaveData.Trident);
    let { Actions } = occupant.SaveData;
    if (Actions === undefined) continue;
    const actions = JSON.parse(Actions);
    Actions = JSON.stringify(actions,null,2);
    console.log(actions);
    // console.log(actions.map(action => action.data.map(data => data.cmd_line)));
    occupant.SaveData.Actions = Actions;
  }
}

/**
 * @param { any } inputData
*/
function gg(inputData){
  /** @type { string } */
  const actionString = inputData.tag.movingEntity.Occupants
    .map(/** @param { any } occupant */ (occupant) => occupant.SaveData.Actions)
    .filter(Boolean);
  /** @type { Record<string,any>[] } */
  const actions = JSON.parse(actionString);
  return actions;
}