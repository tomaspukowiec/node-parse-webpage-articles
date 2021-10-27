import fs from 'fs';

const dateFormat = require('dateformat');

export const currentDate = () => dateFormat(new Date(), 'yyyy-mm-dd H:MM:ss');

export const log = async (file: string, message: string) => {
  console.log(message);
  fs.appendFile(file, `\n[${currentDate()}] ${message}`, (err: any) => {
    if (err) {
      throw new Error(err);
    }
  });
};

export const isEmpty = (value: any) =>
  value === undefined || value === null || value === '';
