import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

import { Article, Config, ParseUrl } from '../models/model';
import { PUPPETEER_OPTIONS } from '../models/const';
import { currentDate, isEmpty } from '../utils/util';

const validateArticle = (article: Article) => {
  if (isEmpty(article.title) || isEmpty(article.href)) {
    throw new Error('Article could not match - missing title or href');
  }
};

const parseUrl = async (url: ParseUrl, config: Config) => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  try {
    const urlNews: ParseUrl = {
      name: url.name,
      link: url.link,
      article: [],
    };
    const urlDomain = `${new URL(url.link).hostname}/`;
    const page = await browser.newPage();
    await page.goto(url.link, { waitUntil: 'networkidle0' });
    const html = await page.content();
    const $ = cheerio.load(html);
    const selector = {
      main: config.parseUrlSelectors.main,
      title: config.parseUrlSelectors.articleTitle,
      text: config.parseUrlSelectors.articleText,
      href: config.parseUrlSelectors.articleDetailHref,
    };
    const elements = $(selector.main);
    elements.each((index: any, el: any) => {
      const article: Article = {
        date: currentDate(),
        title: $(el).find(selector.title).text() || null,
        text: $(el).find(selector.text).first().text() || null,
        href: urlDomain + $(el).find('a').attr(selector.href),
      };
      validateArticle(article);
      urlNews.article.push(article);
    });
    return urlNews;
  } catch (e) {
    throw new Error(`Problem parsing url ${url.link} with error: ${e}`);
  } finally {
    await browser.close();
  }
};

export default parseUrl;
