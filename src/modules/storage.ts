import fs from 'fs';
import { FILE_LOG_INFO, FILE_STORAGE } from '../models/const';
import { Storage, ParseUrl, ArticleNew, Config, Mailer } from '../models/model';
import { generateMailDataWithArticles, sendEmail } from './mail';
import { log } from '../utils/util';

export const getStorageJSON = async () => {
  if (!fs.existsSync(FILE_STORAGE)) {
    const storageFile: Storage = {
      parseUrl: [],
    };
    return storageFile;
  }
  try {
    const storageFile: Storage = JSON.parse(
      fs.readFileSync(FILE_STORAGE, 'utf-8')
    );
    return storageFile;
  } catch (e) {
    throw new Error(`Error when parsing ${FILE_STORAGE} file!\n${e}`);
  }
};

const saveStorageJSON = async (storage: Storage) => {
  fs.writeFileSync(FILE_STORAGE, JSON.stringify(storage));
};

export const handleStorageChanges = async (
  config: Config,
  parseUrlNews: ParseUrl[]
) => {
  const articleNews: ArticleNew[] = [];
  const storage = await getStorageJSON();
  if (storage.parseUrl.length === 0) {
    storage.parseUrl.push(...parseUrlNews);
    parseUrlNews.forEach((parseUrl) => {
      parseUrl.article.forEach((article) => {
        const articleNew: ArticleNew = {
          urlName: parseUrl.name,
          article,
        };
        articleNews.push(articleNew);
      });
    });
  } else {
    parseUrlNews.forEach((url) => {
      const parseUrl: ParseUrl = url;
      const storageParseUrl: ParseUrl = <ParseUrl>(
        storage.parseUrl.find((e) => e.name === parseUrl.name)
      );
      parseUrl.article.forEach((article) => {
        const existsTitle = storageParseUrl.article.some(
          (el) => el.title === article.title
        );
        const existsText = storageParseUrl.article.some(
          (el) => el.text === article.text
        );
        if (!existsTitle || !existsText) {
          storageParseUrl.article.push(article);
          articleNews.push({ urlName: parseUrl.name, article });
        }
      });
    });
  }

  if (articleNews.length > 0) {
    log(FILE_LOG_INFO, `New Articles: ${articleNews.length}`).then();
    await saveStorageJSON(storage)
      .then(() => {
        const mailData: Mailer = generateMailDataWithArticles(
          config,
          articleNews
        );
        sendEmail(mailData);
      })
      .catch((e) => {
        throw new Error(`Error saving ${FILE_STORAGE} : ${e}`);
      });
  } else {
    log(FILE_LOG_INFO, 'There are no new Articles').then();
  }
};
