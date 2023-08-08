import * as fs from 'node:fs/promises';
import * as nbt from 'nbtify';

const inputData = await fs.readFile('input.txt', 'utf8');
const inputActions = getActions(inputData);
console.log(inputActions,"\n");

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

const outputActions = getActions(outputData);
console.log(outputActions,"\n");

await fs.writeFile('output.txt', outputData, 'utf8');
await fs.writeFile('test/inputFormatted.txt', JSON.stringify(inputActions,null,2), 'utf8');
await fs.writeFile('test/outputFormatted.txt', JSON.stringify(outputActions,null,2), 'utf8');

console.info("The NBT has been written to output.txt.");

/**
 * @param { string } inputData
*/
function getActions(inputData){
  const nbtObject = nbt.parse(inputData);
  /** @type { string } */
  const actionString = nbtObject.tag.movingEntity.Occupants
    .map(/** @param { any } occupant */ (occupant) => occupant.SaveData.Actions)
    .filter(Boolean);
  /** @type { Record<string,any>[] } */
  const actions = JSON.parse(actionString);
  return actions;
}