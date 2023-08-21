const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const XLSX = require('xlsx');
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({blockTrackers: true}))

//let link = 'https://www.detmir.ru/catalog/index/name/podushki/page/';
let link = 'https://www.detmir.ru/catalog/index/name/puppet_theatre/page/';


(async () => {
    let start = Date.now();
    let flag = 2;
    let res = [];
    let counter = 6;
    let slowMo = 0;

    let browser = await puppeteer.launch({
        headless: false,
        slowMo: slowMo,
        //devtools: true
    })

    let page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom())
    await page.setViewport({
        width: 1400, height: 900
    })
    //await page.goto(`https://www.detmir.ru`);

   /* await page.waitForSelector('span.iT2', {timeout: 2000})  // 20000
        .then(async () => {
            let html = await page.evaluate(async () => {
                let divs = document.querySelector('span.iT').innerText;
                return divs;
            }, {waitUntil: 'load'});

        })
        .catch(e => {
            console.log('== NEXT ==');
        }); */


    while (!!flag) {
        await page.goto(`${link}${counter}`);

        await page.waitForSelector('section', {timeout: 5000})
        //await page.waitForSelector('div.ui-button-widget', {timeout: 2000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    let page = [];
                    //let divs = document.querySelectorAll('div.ui-button-widget');
                    let divs = document.querySelectorAll('div.v_6 section');

                    divs.forEach(div => {
                       // title.indexOf('Гарантия')!==-1
                        if (div.querySelector('div.H_1 span')==null){
                            
                        
                        //let a = div.querySelector('a.ui-link');
                        let a = div.querySelector('a');
                        let obj = {href: a.href};
                        page.push(obj);
                    }

                    })
                    return page;
                }, {waitUntil: 'load'});

                res = res.concat(html);
                //console.log(html)
                console.log('SUCCESS / ' + counter + ' / ' + html.length);
                counter++;
                if (html.length==0){flag=false}
            }).catch(e => {
                //flag--;
                console.log('== FALSE ==');
            });
    }


    
        let binaryWS = XLSX.utils.json_to_sheet(res);
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
        XLSX.writeFile(wb, 'DNS_shop.xlsx');

    await browser.close()
    let end = Date.now();
    console.log(res.length + 'шт за ' + (end - start) / 1000 + ' сек');
    await double(res);
})();


let double = async (arrSecondRounds) => {
    let start = Date.now();
    let flag = 4;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds;
    let totalElements = arrSecondRound.length;

    let type = 'Мягкие игрушки подушки';

    let browser = await puppeteer.launch({
        headless: false,
        slowMo: 0,
        //devtools: true
    })

    let page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom())
    await page.setViewport({
        width: 1400, height: 900
    })

    while (!!flag) {
        await page.goto(`${arrSecondRound[counter].href}`, {timeout: 50000, waitUntil: 'networkidle2'})

        await page.waitForSelector('div.iH', {timeout: 15000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    let child = document.querySelector('table.XR tbody').childNodes;
                    let page = [];
                    let Annotation = document.querySelector('section.Bz div.Ye').innerText;
                    let price = document.querySelector('div.bao p.bav').innerText.slice(0,-2);
                    let name = document.querySelector('section h1').innerText;
                    let mainImg = document.querySelector('div div.swiper-wrapper').childNodes[0].querySelector('div div picture source').srcset.split(',')[0].slice(0,-3);

                    //document.querySelector('div.bcY div.swiper-wrapper').childNodes[2].querySelector('div div picture source').srcset

                    let obj = {
                        '№':'',
                        'Название': name,
                        'Цена': price,
                        'Ссылка на главное фото': mainImg,
                        'Аннотация': Annotation,
                    };

                    for (let k = 0; k < child.length; k++) {
                            let title = child[k].querySelector('th.XV span').innerText;
                            let value_child = child[k].querySelector('td.XW').innerText;
                            obj[title] = value_child;
                    }

                    page.push(obj);

                    return page;
                }, {waitUntil: 'networkidle2'});
                res = res.concat(html);
                counter++; 
                if (arrSecondRound.length == counter) {
                    flag = false;
                }

                let binaryWS = XLSX.utils.json_to_sheet(res);
                let wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, binaryWS, '1')
                XLSX.writeFile(wb, `${type}_${totalElements}.xlsx`);

                //console.log(html);
                console.log('SUCCESS / ' + counter + '/' + totalElements);


            }).catch(e => {
                console.log('== FALSE ==');
            });
    }


    let binaryWS = XLSX.utils.json_to_sheet(res);
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, '1')
    XLSX.writeFile(wb, `${type}_${totalElements}.xlsx`);

    console.log(res)
    await browser.close()
    let end = Date.now();
    console.log((end - start) / 1000);
};




