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
    let counter = 1;
    try {
        let browser = await puppeteer.launch({
            headless: false,
            slowMo: 100,
            devtools: true
        })
        //randomUseragent.getRandom();
        let page = await browser.newPage();
        //await page.setUserAgent(userAgent.random().toString())
        await page.setUserAgent(randomUseragent.getRandom())
        await page.setViewport({
            width: 1400, height: 900
        })
        while (flag) {
            await page.goto(`${link}${counter}`);
            //await page.waitForSelector('a.pagination-widget__page-link_next').then(() => {
            await page.waitForSelector('a.catalog-product__image-link').then(() => {
                console.log('SUCCESS');
            }).catch(e => {
                console.log('FAIL');
            });


            console.log(counter);

            let html = await page.evaluate(async () => {
                let page = [];
                try {
                    let divs = document.querySelectorAll('div.ui-button-widget');
                    divs.forEach(div => {
                        let a = div.querySelector('a.ui-link')
                        let obj = {
                            title: a.innerText,
                            link: a.href,
                            price: div.querySelector('div.product-buy__price').innerText
                        }
                        page.push(obj);
                    })
                } catch (e) {
                    console.log(e);
                }finally {
                    console.log('finally')
                }
                return page;
            //}, {waitUntil: 'a.pagination-widget__page-link_next'});
            }, {waitUntil: 'networkidle0'});
            await res.push(html);
            counter++
            console.log(html)
            if (counter > 5) {
                flag = false
            }
        }
    } catch (e) {
        console.log(e);
        await browser.close()
    }
})();