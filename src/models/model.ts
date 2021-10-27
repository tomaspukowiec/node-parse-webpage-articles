export interface Config {
  parseUrl: ParseUrl[];
  parseUrlSelectors: ParseUrlSelectors;
  mailer: Mailer;
}

export interface Storage {
  parseUrl: ParseUrl[];
}

export interface ParseUrl {
  name: string;
  link: string;
  article: Article[];
}

export interface Article {
  date: string;
  title: string | null;
  text: string | null;
  href: string | null;
}

export interface ArticleNew {
  urlName: string;
  article: Article;
}

export interface ParseUrlSelectors {
  main: string;
  articleTitle: string;
  articleText: string;
  articleDetailHref: string;
}

export interface Mailer {
  host: string;
  port: string;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  mailOptions: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  };
  admin?: string;
}
