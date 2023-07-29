const userAgent = require('user-agents');
const randomUseragent = require('random-useragent');
const fs = require('fs');
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
    let counter = 0;
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
            await page.waitForSelector('a.catalog-product__image-link').then(async () => {
                console.log('SUCCESS');


                /*   1    */

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
                    } finally {
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
                    // array of objects to save in Excel
                    //let binaryUnivers = [{'name': 'Hi','value':1},{'name':'Bye','value':0}]
                    let binaryWS = XLSX.utils.json_to_sheet(html);
                    // Create a new Workbook
                    let wb = XLSX.utils.book_new()
                    // Name your sheet
                    XLSX.utils.book_append_sheet(wb, binaryWS, 'Binary values')
                    // export your excel
                    XLSX.writeFile(wb, 'Binaire.xlsx');
                }

                /*   -1    */


            }).catch(e => {
                console.log('FAIL');
            });

            /*  1 - 1    */

        }

        console.log(res)


    } catch (e) {
        console.log(e);
        await browser.close()
    }
})();