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

let ret=async () => {
    let flag = 2;
    let res = [];
    let counter = 26;

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



//})();
};



let double = async (arrSecondRounds) => {

    let flag = 4;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds


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
        await page.goto(`${arrSecondRound[counter]}`);
        // let tiser = document.querySelector('div.product-card-description-text').innerText;
        //console.log(tiser);
        await page.waitForSelector('div.product-card-description-text', {timeout: 15000})
            .then(async () => {
                console.log('SUCCESS');
                console.log(counter);
                let html = await page.evaluate(async () => {
                    let page = [];
                    let name = document.querySelector('h1.product-card-top__title').innerText;
                    let specs = document.querySelector('div.product-card-top__specs').innerText;
                    let price = document.querySelector('div.product-buy__price').innerText;
                    let description = document.querySelector('div.product-card-description-text').innerText;
                    //let link = arrSecondRound[counter];
                    let mainImg = document.querySelector('img.product-images-slider__main-img').src;

                    //let a = divs.querySelector('div.product-card-description-text');
                    //let title = divs.innerText;
                    let obj = {
                        name: name,
                        specs: specs,
                        price: price,
                        description: description,
                        //link: link,
                        mainImg: mainImg,
                    }
                    page.push(obj);

                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                //res.push(html);
                counter++;
                //console.log(res)
                if (arrSecondRound.length == counter || counter == 10) {
                    flag = 0
                }




            }).catch(e => {
                flag--;
                console.log('FALSE = ' + flag);
            });
    }

    let binaryWS = XLSX.utils.json_to_sheet(res);
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
    XLSX.writeFile(wb, 'DNS_shop_advanced.xlsx');

    console.log(res)
    await browser.close()

};





(async () => {
    let arrSecondRound = ['https://www.dns-shop.ru/product/e85a7fbcf8c1c823/141-noutbuk-irbis-nb248-cernyj/',
        'https://www.dns-shop.ru/product/a9069bce37c6ed20/141-noutbuk-dexp-aquilon-serebristyj/',
        'https://www.dns-shop.ru/product/e259ba0deda12ff2/14-noutbuk-irbis-nb257-seryj/',
        'https://www.dns-shop.ru/product/9e7bf670f0052065/14-noutbuk-irbis-nb283-seryj/',
        'https://www.dns-shop.ru/product/5b988b0337c5ed20/141-noutbuk-dexp-aquilon-serebristyj/'];

   await double(arrSecondRound);
})();