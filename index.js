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

(async () => {
    let flag = true;
    let res = [];
    let counter = 1;
    try {
        let browser = await puppeteer.launch({
            headless: false,
            //slowMo: 100,
            devtools: true
        })

        let page = await browser.newPage();
        await page.setUserAgent(randomUseragent.getRandom())
        await page.setViewport({
            width: 1400, height: 900
        })
        while (flag) {
            await page.goto(`${link}${counter}`);
            await page.waitForSelector('a.catalog-product__image-link').then(async () => {
                console.log('SUCCESS');
                console.log(counter);
                let html = await page.evaluate(async () => {
                    console.log('evaluate');
                    let page = [];
                    let divs = document.querySelectorAll('div.ui-button-widget');
                    divs.forEach(div => {
                        let a = div.querySelector('a.ui-link');
                        let title = a.innerText.split('[');
                        let obj = {
                            title: title[0],
                            description: title[1].slice(0, -1),
                            link: a.href,
                            price: div.querySelector('div.product-buy__price').innerText
                        }
                        page.push(obj);
                    })
                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                counter++
                console.log(html)
                if (counter > 5) {
                    flag = false
                    let binaryWS = XLSX.utils.json_to_sheet(res);
                    let wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
                    XLSX.writeFile(wb, 'DNS_shop.xlsx');
                }
            }).catch(e => {
                console.log('FAIL');
            });
        }
        console.log(res)
    } catch (e) {
        console.log(e);
        await browser.close()
    }
})();
