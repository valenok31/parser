const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const XLSX = require('xlsx');
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({blockTrackers: true}))

//let link = 'https://www.dns-shop.ru/catalog/17a892f816404e77/noutbuki/?p=';
//let link = 'https://www.dns-shop.ru/catalog/86bcb70a1543b316/payalnye-feny/?p=';
let link = 'https://www.dns-shop.ru/catalog/17aa00d516404e77/nabory-ruchnogo-instrumenta/?p=';

(async () => {
    let start = Date.now();
    let flag = 2;
    let res = [];
    let counter = 1;

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
        await page.waitForSelector('a.catalog-product__image-link', {timeout: 5000})
            .then(async () => {


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
                counter++;
                console.log('SUCCESS / ' + counter + ' / ' + html.length);
            }).catch(e => {
                flag--;
                console.log('== FALSE ==');
            });
    }

/*    let binaryWS = XLSX.utils.json_to_sheet(res);
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
    XLSX.writeFile(wb, 'DNS_shop.xlsx');*/

    await browser.close()
    let end = Date.now();
    console.log((end - start)/1000);
   await double(res);
})();



let double = async (arrSecondRounds) => {
    let start = Date.now();
    let flag = 4;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds;
    let totalElements = arrSecondRound.length;


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
        await page.waitForSelector('div.product-card-description-text', {timeout: 15000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    let page = [];
                    let name = document.querySelector('h1.product-card-top__title').innerText;
                    let specs = document.querySelector('div.product-card-top__specs').innerText;
                    let price = document.querySelector('div.product-buy__price').innerText;
                    let description = document.querySelector('div.product-card-description-text').innerText;
                    let link = window.location.href;
                    let mainImg = document.querySelector('img.product-images-slider__main-img').src;

                    let obj = {
                        name: name,
                        specs: specs,
                        price: price,
                        description: description,
                        link: link,
                        mainImg: mainImg,
                    }
                    page.push(obj);

                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                counter++;
                if (arrSecondRound.length == counter || counter == 10) {
                    flag = 0
                }
                console.log('SUCCESS / ' + counter + '/' + totalElements);
            }).catch(e => {
                console.log('== FALSE ==');
            });
    }

    let binaryWS = XLSX.utils.json_to_sheet(res);
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
    XLSX.writeFile(wb, 'DNS_shop_advanced.xlsx');

    console.log(res)
    await browser.close()
    let end = Date.now();
    console.log((end - start)/1000);
};




