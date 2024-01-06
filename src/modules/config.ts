import fs from 'fs';
import { FILE_CONFIG } from '../models/const';
import { Config } from '../models/model';
import { isEmpty } from '../utils/util';

const validateFields = async (configFile: Config) => {
  if (!configFile || configFile.parseUrl.length <= 0) {
    throw new Error('-> Missing parseUrl configuration');
  }
  if (isEmpty(configFile.mailer)) {
    throw new Error('-> Missing mailer configuration');
  }
  configFile.parseUrl.forEach((el) => {
    if (isEmpty(el.name) || isEmpty(el.link)) {
      throw new Error(
        '-> Missing mandatory fields for parseUrl object (name, link)'
      );
    }
  });
  if (
    isEmpty(configFile.parseUrlSelectors) ||
    isEmpty(configFile.parseUrlSelectors.main) ||
    isEmpty(configFile.parseUrlSelectors.articleTitle)
  ) {
    throw new Error('-> Missing parseUrlSelectors configuration');
  }
};

const getConfigJSON = async () => {
  if (!fs.existsSync(FILE_CONFIG)) {
    throw new Error(`${FILE_CONFIG} file does not exist!`);
  }
  try {
    const configFile: Config = JSON.parse(
      fs.readFileSync(FILE_CONFIG, 'utf-8')
    );
    await validateFields(configFile);
    return configFile;
  } catch (e) {
    throw new Error(`Error when parsing ${FILE_CONFIG} file!\n${e}`);
  }
};

export default getConfigJSON;
