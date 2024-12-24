import { exec } from 'child_process';

const execCommand = (command) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) reject(error);
        resolve(stdout);
      });
    });
  };

export {execCommand}
