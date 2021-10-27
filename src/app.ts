import parseUrl from './modules/parser';
import { Config } from './models/model';
import getConfigJSON from './modules/config';
import { handleStorageChanges } from './modules/storage';
import { generateMailDataWithError, sendEmail } from './modules/mail';
import { log } from './utils/util';
import { FILE_LOG_ERROR, FILE_LOG_INFO } from './models/const';

(async () => {
  try {
    const config: Config = await getConfigJSON();

    await Promise.all(
      config.parseUrl.map(async (url) => {
        log(FILE_LOG_INFO, `PARSING url:${url.name}`).then();
        return parseUrl(url, config)
          .then((data) => {
            log(FILE_LOG_INFO, `PARSING FINISHED url:${url.name}`).then();
            return data;
          })
          .catch((err: any) => {
            log(FILE_LOG_ERROR, `ERROR in url:${url.name}`).then();
            throw new Error(err);
          });
      })
    )
      .then((data) => {
        log(FILE_LOG_INFO, 'Finished all parsers').then();
        return handleStorageChanges(config, data).catch((e) => {
          throw new Error(e);
        });
      })
      .catch((error) => {
        const message = `Error in promises ${error}`;
        log(FILE_LOG_ERROR, message).then();
        sendEmail(generateMailDataWithError(config, message));
      });
  } catch (err: any) {
    log(FILE_LOG_ERROR, err).then();
  }
})();
