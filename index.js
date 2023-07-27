const userAgent = require('user-agents');
const randomUseragent = require('random-useragent');
const fs = require('fs');
const puppeteer = require('puppeteer-extra');

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

let link = 'https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/?p=';

(async () => {
    let flag = true;
    let res = [];
    let counter = 2;
    try {
        let browser = await puppeteer.launch({
            headless: false,
            slowMo: 100,
            devtools: true
        })
        randomUseragent.getRandom();
        let page = await browser.newPage();
        await page.setUserAgent(userAgent.random().toString())
        await page.setViewport({
            width: 1400, height: 900
        })
        while (flag) {

            await page.waitForSelector('div.products-list').then(() => {
                console.log('SUCCESS');
            }).catch(e => {
                console.log('FAIL');
            });
            await page.goto(`${link}${counter}`);

            console.log(counter);
            let html = await page.evaluate(async () => {
                let page = [];
                try {
                    let divs = document.querySelectorAll('div.catalog-product');
                    divs.forEach(div => {
                        let a = div.querySelector('a.ui-link')
                        let obj = {
                            title: a.innerText,
                            link: a.href,
                            price: div.querySelector('div.product-buy__price').innerText
                        }
                        console.log('obj')
                        page.push(obj);
                    })
                } catch (e) {
                    console.log(e);
                }
                return page;
            }, {waitUntil: 'a.pagination-widget__page-link_next'});
            await res.push(html);
            counter++
            console.log('123');
            if (counter > 10) {
                flag = false
            }
        }
    } catch (e) {
        console.log(e);
        await browser.close()
    }
})();