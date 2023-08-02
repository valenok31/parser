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

(async () => {
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
                        let obj = a.href;
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

    console.log(res);


   await double(res);



})();



let double = async (arrSecondRounds) => {
    let flag = true;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds;


    try {
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
        while (flag) {
            await page.goto(`${arrSecondRound[counter]}`);
            // let tiser = document.querySelector('div.product-card-description-text').innerText;
            //console.log(tiser);
            await page.waitForSelector('div.product-card-description-text').then(async () => {
                console.log('SUCCESS');
                console.log(counter);
                // let tiser = document.querySelector('div.product-card-description-text').innerText;
                // console.log(tiser);
                let html = await page.evaluate(async () => {
                    console.log('evaluate');
                    let page = [];
                    let divs = document.querySelector('div.product-card-description-text').innerText;

                    //let a = divs.querySelector('div.product-card-description-text');
                    //let title = divs.innerText;
                    let obj = {
                        title: divs,
                    }
                    page.push(obj);

                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                //res.push(html);
                counter++;
                //console.log(res)
                if (counter > 3) {
                    flag = false
                    let binaryWS = XLSX.utils.json_to_sheet(res);
                    let wb = XLSX.utils.book_new()
                    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
                    XLSX.writeFile(wb, 'DNS_shop_advanced.xlsx');

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
};