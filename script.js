import * as fs from 'node:fs/promises';
import * as nbt from 'nbtify';

const inputData = await fs.readFile('input.txt', 'utf8');
const inputFormatted = nbt.stringify(nbt.parse(inputData),{ space: 2 });
console.log(JSON.parse(nbt.parse(inputFormatted).tag.movingEntity.Occupants.map(occupant => occupant.SaveData.Actions).filter(Boolean)[0]),"\n");

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
const outputFormatted = nbt.stringify(nbt.parse(outputData),{ space: 2 });
console.log(JSON.parse(nbt.parse(outputFormatted).tag.movingEntity.Occupants.map(occupant => occupant.SaveData.Actions).filter(Boolean)[0]),"\n");

await fs.writeFile('output.txt', outputData, 'utf8');
await fs.writeFile('inputFormatted.txt', inputFormatted, 'utf8');
await fs.writeFile('outputFormatted.txt', outputFormatted, 'utf8');

console.info("The NBT has been written to output.txt.");