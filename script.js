const fs = require('fs');
function main() {
  const inputData = fs.readFileSync('input.txt', 'utf8');
  const regex = /\\\"button_name\\\":\\\"([^,]*?)\\\",(\\\"data\\\":\[.*?\]),\\\"mode\\\".*?,\\\"text\\\":\\\"(.*?)\\\"/g;
  const outputData = inputData.replace(regex, (_match, buttonName, data, _text) => {
    const commands = data.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",(\\\"cmd_ver\\\":|$)/g);
    const commandLines = commands.map(cmd => {
      const cmdLine = cmd.match(/\\\"cmd_line\\\":\\\"(.*?)\\\",/);
      return cmdLine ? cmdLine[1].replace(/\\\\"/g, '\\\\\"') : '';
    });
    const joinedCommands = commandLines.join('\\\\n');
    return `\\\"button_name\\\":\\\"${buttonName}\\\",${data},\\\"mode\\\".*?,\\\"text\\\":\\\"${joinedCommands}\\\"`;
  });

  const fixedOutputData = outputData.replace(/(.*?)\.\*\?/g, '$1:0');
  fs.writeFileSync('output.txt', fixedOutputData, 'utf8');
}
main();
