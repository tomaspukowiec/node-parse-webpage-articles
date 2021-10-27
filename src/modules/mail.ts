import { ArticleNew, Config, Mailer } from '../models/model';
import { isEmpty, log } from '../utils/util';
import { FILE_LOG_ERROR, FILE_LOG_INFO } from '../models/const';

const nodemailer = require('nodemailer');

const validateMailData = async (mailData: Mailer) => {
  if (
    isEmpty(mailData.host) ||
    isEmpty(mailData.port) ||
    isEmpty(mailData.auth.user) ||
    isEmpty(mailData.auth.pass) ||
    isEmpty(mailData.mailOptions.to) ||
    isEmpty(mailData.mailOptions.subject) ||
    isEmpty(mailData.mailOptions.html)
  ) {
    throw new Error('Mail configuration is missing');
  }
};

export const sendEmail = async (mailerData: Mailer) => {
  await validateMailData(mailerData);
  const transporter = nodemailer.createTransport({
    host: mailerData.host,
    port: mailerData.port,
    secure: mailerData.secure,
    auth: {
      user: mailerData.auth.user,
      pass: mailerData.auth.pass,
    },
  });

  await transporter.sendMail(
    {
      from: mailerData.auth.user,
      to: mailerData.mailOptions.to,
      subject: mailerData.mailOptions.subject,
      text: mailerData.mailOptions.text,
      html: mailerData.mailOptions.html,
    },
    (error: any, info: any) => {
      if (error) {
        log(FILE_LOG_ERROR, error).then();
      } else {
        log(FILE_LOG_INFO, `Message sent: ${info.response}`).then();
      }
      transporter.close();
    }
  );
  await transporter.close();
};

export const getMailConfig = (config: Config) => ({
  host: config.mailer.host,
  port: config.mailer.port,
  secure: config.mailer.secure,
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass,
  },
  mailOptions: {
    to: config.mailer.mailOptions.to,
    subject: config.mailer.mailOptions.subject,
    html: '',
  },
});

export const generateMailDataWithArticles = (
  config: Config,
  articleNews: ArticleNew[]
) => {
  const mailData = getMailConfig(config);
  let html = '';
  articleNews.forEach((article) => {
    html += `<strong>Sekce:</strong> ${article.urlName}<br>`;
    html += `<strong>Nadpis:</strong> ${article.article.title}<br>`;
    html += `<strong>Text:</strong> ${article.article.text}<br>`;
    html += `<a href='${article.article.href}' title='${article.article.title}'>-> Odkaz na detail <-</a><br><br>`;
  });
  mailData.mailOptions.html = html;
  return mailData;
};

export const generateMailDataWithError = (config: Config, message: string) => {
  const mailData = getMailConfig(config);
  if (config.mailer.admin) {
    mailData.mailOptions.to = config.mailer.admin;
    mailData.mailOptions.subject = 'Error - Školka klíček';
    mailData.mailOptions.html = message;
  } else {
    mailData.mailOptions.to = '';
  }
  return mailData;
};
