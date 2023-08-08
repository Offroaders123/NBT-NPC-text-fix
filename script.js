const fs = require('fs');

async function main() {
  const nbt = await import("nbtify");
  const inputData = fs.readFileSync('input.txt', 'utf8');
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
  fs.writeFileSync('output.txt', outputData, 'utf8');
  fs.writeFileSync('inputFormatted.txt', inputFormatted, 'utf8');
  fs.writeFileSync('outputFormatted.txt', outputFormatted, 'utf8');
  console.info("The NBT has been written to output.txt.")
}

main();
