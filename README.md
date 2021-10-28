# node-parse-webpage-articles

Simple Node application for parsing webpage articles according configuration. Notify about new articles by email.

## The idea behind the project

My son goes to kindergarten. The kindergarten is very active on their website and regularly informs parents. So in order not to lose any news, I created this script.\
The idea was to make it as simple as possible without so many features. I didn't want to use a database, so the data about the discovered articles is stored in a file.\
In the News and Articles I am interested about TITLE, Initial TEXT and HREF to detailed article

## Example of html code which is parsed

```html
<div id='content'>
  <div class='row justify-content-center dlazdice'>
    <div class='nadpis'>AKTUALITY</div>
    <div class='col-md-3 text-box-obsah'>
      <h2>Article title 01</h2>
      <p>Article text 01</p>
      <p>
        <a class='btn btn-secondary tlacitko' href='index.php?p=some-page-01' role='button'>Show more...</a>
      </p>
    </div>
    <div class='col-md-3 text-box-obsah'>
      <h2>Article title 02</h2>
      <p>Article text 02</p>
      <p>
        <a class='btn btn-secondary tlacitko' href='index.php?p=some-page-02' role='button'>Show more...</a>
      </p>
    </div>
  </div>
</div>
````

## Configuration

Requires **config.json** file in the ROOT

```abc
{
  "parseUrl": [
    {
      "name": "my-url-name-1",
      "link": "https://example-domain.com"
    },
    {
      "name": "my-url-name-2",
      "link": "https://example-domain.com/articles/"
    }
  ],
  "parseUrlSelectors": {
    "main": "div#content div.text-box-obsah",
    "articleTitle": "h2",
    "articleText": "p",
    "articleDetailHref": "href"
  },
  "mailer": {
    "host": "smtp.seznam.cz",
    "port": "465",
    "secure": true,
    "auth": {
      "user": "example@domain.com",
      "pass": "MySuperSecretPassword"
    },
    "mailOptions": {
      "to": "recipient1@domain.com, recipient2@domain.com",
      "subject": "Subject for email"
    },
    "admin": "admin@domain.com"
  }
}

````

## Build & Installation

1. Fork this git-repo
2. npm install
3. npm run build
4. -> This will generate (using webpack) bundled version in the ./dist/app.bundle.js

## Deploy & Run

1. Copy/Deploy app.bunde.js to your hosting with running Node env
2. npm install --production
3. Adjust config.json based on your needs and copy it to the same location as app.bundle.js
4. node app.bundle.js
5. Make this script run (CRON JOB) every 1 hour or so
6. As default APP logs info messages to **./info.log** and error messages to **./error.log**
7. Articles are stored to file **./storage.json**

## NPM packages used

* puppeteer (API to control Chrome or Chromium)
* cheerio (Fast, flexible & lean implementation of core jQuery designed specifically for the server.)
* nodemailer (Send e-mails) 
