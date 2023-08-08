import * as fs from 'node:fs/promises';
import * as nbt from 'nbtify';

const inputData = await fs.readFile('input.txt', 'utf8');
console.log(inputData,"\n");

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
console.log(outputData,"\n");

await fs.writeFile('output.txt', outputData, 'utf8');

console.info("The NBT has been written to output.txt.");