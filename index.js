//require('./secondRound')

//const userAgent = require('user-agents');
const randomUseragent = require('random-useragent');
//const fs = require('fs');
const puppeteer = require('puppeteer-extra');
const XLSX = require('xlsx');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({blockTrackers: true}))

let link = 'https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/?p=';
//let link = 'https://www.dns-shop.ru/catalog/86bcb70a1543b316/payalnye-feny/?p=';

let arrSecondRound = (async () => {
    let flag = 2;
    let res = [];
    let counter = 25;

        let browser = await puppeteer.launch({
            headless: false,
            //slowMo: 100,
            //devtools: true
        })

        let page = await browser.newPage();
        await page.setUserAgent(randomUseragent.getRandom())
        await page.setViewport({
            width: 1400, height: 900
        })


        while (!!flag) {
            await page.goto(`${link}${counter}`);

            // await page.waitForSelector('a.catalog-product__image-link')
            await page.waitForSelector('a.catalog-product__image-link', {timeout: 5000})
                .then(async () => {

                    console.log('SUCCESS');
                    console.log(counter);
                    let html = await page.evaluate(async () => {
                        let page = [];
                        let divs = document.querySelectorAll('div.ui-button-widget');

                        divs.forEach(div => {
                            let a = div.querySelector('a.ui-link');
                            //let title = a.innerText.split('[');
                            let title = a !== null
                                ? a.innerText.split('[')
                                : ['NO-TITLE', 'NO-DESCRIPTION]']
                            let obj = {
                                title: title[0],
                                description: title[1].slice(0, -1),
                                link: a.href,
                                price: div.querySelector('div.product-buy__price') !== null
                                    ? div.querySelector('div.product-buy__price').innerText
                                    : 'NO-PRICE'
                            }
                            page.push(obj);
                        })
                        return page;
                    }, {waitUntil: 'load'});

                    res = res.concat(html);
                    counter++
                    console.log('length = ' + html.length)
                }).catch(e => {
                    flag--;
                    console.log('FALSE = ' + flag);
                });
            //let maxCounters6 = document.querySelectorAll('li.pagination-widget__page');
            //let maxCounter = +maxCounters6[maxCounters6.length-1].dataset.pageNumber;
            //console.log(maxCounter);


        }

        let binaryWS = XLSX.utils.json_to_sheet(res);
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
        XLSX.writeFile(wb, 'DNS_shop.xlsx');

        await browser.close()

    return res;
});

console.log(arrSecondRound())