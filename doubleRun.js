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
let link = 'https://www.dns-shop.ru/catalog/17a8f91c16404e77/videokabeli-i-perexodniki/?p=';
//let link = 'https://www.detmir.ru/catalog/index/name/myagkye/page/';



(async () => {
    let start = Date.now();
    let flag = 2;
    let res = [];
    let counter = 0;
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
    await page.goto(`https://www.dns-shop.ru`);

    await page.waitForSelector('span.iT2', {timeout: 20000})
    .then(async () => {
        let html = await page.evaluate(async () => {
            let divs = document.querySelector('span.iT').innerText;
            return divs;
        }, {waitUntil: 'load'});  
        
    })
    .catch(e => {
        console.log('== NEXT ==');
    });

 /*   function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      console.log("меняем регион");
      sleep(10000).then(() => { console.log("Next"); });*/
   // let element = document.querySelector('span.iT');
   // console.log(element.innerText)
    //await element.click(element);

    while (!!flag) {
        await page.goto(`${link}${counter}`);

        //await page.waitForSelector('section.H_1', {timeout: 5000})
        await page.waitForSelector('div.ui-button-widget', {timeout: 5000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    let page = [];
                    let divs = document.querySelectorAll('div.ui-button-widget');
                    //let divs = document.querySelectorAll('section.H_1');

                    divs.forEach(div => {
                        let a = div.querySelector('a.ui-link');
                        //let a = div.querySelector('a.Ib');
                        let obj = {href: a.href};
                        page.push(obj);
                    })
                    return page;
                }, {waitUntil: 'load'});

                res = res.concat(html);
                counter++;
                console.log('SUCCESS / ' + counter + ' / ' + html.length);
                if (counter>5){flag=false}
            }).catch(e => {
                flag--;
                console.log('== FALSE ==');
            });
    }

    let binaryWS = XLSX.utils.json_to_sheet(res);
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
    XLSX.writeFile(wb, 'DNS_shop.xlsx');

    await browser.close()
    let end = Date.now();
    console.log(res.length + 'шт за ' + (end - start)/1000 + ' сек');
   await double_dns(res);
   //await double(res);
})();


/*
let res = [
'https://www.dns-shop.ru/product/33f3b66102a83332/kabel-soedinitelnyj-dexp-displayport---displayport-18-m/',
'https://www.dns-shop.ru/product/906a6a41f9923332/kabel-soedinitelnyj-ugreen-displayport---dvi-d-2-m/',
'https://www.dns-shop.ru/product/2b9bdb25f98a3332/kabel-soedinitelnyj-ugreen-displayport---vga-15-m/',
'https://www.dns-shop.ru/product/3f86de3ffb2b3332/kabel-soedinitelnyj-ugreen-hdmi---dvi-d-5-m/',
]
*/





let double_dns = async (arrSecondRounds) => {
    let start = Date.now();
    let flag = 4;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds;
    let totalElements = arrSecondRound.length;

    let browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        //devtools: true
    })

    let page = await browser.newPage();
    await page.setUserAgent(randomUseragent.getRandom())
    await page.setViewport({
        width: 1400, height: 900
    })

    await page.goto(`https://www.dns-shop.ru`);

    await page.waitForSelector('span.iT2', {timeout: 20000})
        .then(async () => {
            let html = await page.evaluate(async () => {
                let divs = document.querySelector('span.iT').innerText;
                return divs;
            }, {waitUntil: 'load'});

        })
        .catch(e => {
            console.log('== NEXT ==');
        });

    while (!!flag) {
        await page.goto(`${arrSecondRound[counter].href}characteristics/`);

        await page.waitForSelector('div.product-card-description-text', {timeout: 15000})
        //await page.waitForSelector('img.product-images-slider__img', {timeout: 15000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    //let child = document.querySelector('div.product-characteristics-content').childNodes;
                    let page = [];
                    let name = document.querySelector('a.product-card-tabs__product-title').innerText;
                    //*let specs = document.querySelector('div.product-card-top__specs').innerText;
                    let price = document.querySelector('div.product-buy__price').innerText.slice(0,-2);
                    let article = document.querySelector('div.product-card-top__code').innerText;
                    article=article.slice(12);
                    let Part_number = document.querySelector('div.product-characteristics-content').childNodes[1]?.childNodes[3]?.childNodes[1].innerText;
                    let brand = document.querySelector('div.product-characteristics-content').childNodes[1]?.childNodes[2]?.childNodes[1].innerText;
                    let model_name = document.querySelector('div.product-characteristics-content').childNodes[1]?.childNodes[1]?.childNodes[1].innerText;
                    let product_color = document.querySelector('div.product-characteristics-content').childNodes[1]?.childNodes[4]?.childNodes[1].innerText;
                    if(!product_color){product_color=Part_number, Part_number=''}else{Part_number=Part_number.slice(1,-1)};
                    let Manufacturer_country = document.querySelector('div.product-characteristics-content').childNodes[0]?.childNodes[2]?.childNodes[1].innerText;
                    let Warranty_period = document.querySelector('div.product-characteristics-content').childNodes[0]?.childNodes[1]?.childNodes[1].innerText;
                    let Length = document.querySelector('div.product-characteristics-content').childNodes[3]?.childNodes[1]?.childNodes[1].innerText.slice(0,-2);
                    if(Length=='н'){Length='нет'}
                    //if(Length!='нет'){Length=Length.slice(0,-2)}
                    let Annotation = document.querySelector('div.product-card-description-text').innerText;
                    //*let link = window.location.href;
                    let mainImg = document.querySelector('img.product-images-slider__main-img').src;
























                    let obj = {
                        no: '',
                        article: article,
                        name: name,
                        price: price,
                        price_before_discount: '',
                        nds: 'Не облагается',
                        enable_promotion: '',
                        ozonID: '',
                        commercial_type: 'Видео кабели и переходники',
                        barcode: '',
                        weight:'1000',
                        width:'100',
                        height:'100',
                        length:'100',
                        main_photo: mainImg,
                        additional_photo: '',
                        photo_360: '',
                        article_photo: '',
                        brand: brand.trim(),
                        model_name:name,  
                        product_color:product_color,
                        interfaces:'',
                        number_of_output_connectors:'',
                        Length:Length.trim(),
                        Units_in_one_product:'',
                        Type:'Кабель-переходник (адаптер)', //Какой тип??
                        Equipment:'',
                        Compatibility:'',
                        Rich_JSON_content:'',
                        Series_name:'',
                        Annotation:Annotation,
                        Keywords:'',
                        Part_number: Part_number,
                        HS_Code_electronics:'',
                        Appointment:'',
                        Type_of_twisted_pair:'',
                        Category_of_patch_cord_and_twisted_pair:'',
                        Number_of_veins:'',
                        Interface_version:'',
                        Connector1:'',
                        Connector2:'',
                        Connector_type1:'',
                        Connector_type2:'',
                        Max_current:'',
                        Fast_Charging_standard:'',
                        Conductor_Materials:'',
                        outer_shell_of_cable:'',
                        Technological_features:'',
                        Design_features:'',
                        Sizes:'',
                        Product_weight:'',
                        Manufacturer_country:Manufacturer_country,
                        Warranty_period:Warranty_period,
                        Number_of_factory_packages:1,
                        Mistake:'',
                        warning:'',
                    }
                    page.push(obj);

                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                counter++;
                if (arrSecondRound.length == counter) {
                    flag = 0
                }

                let binaryWS = XLSX.utils.json_to_sheet(res);
                let wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
                XLSX.writeFile(wb, 'DNS_shop_advanced.xlsx');


                console.log('SUCCESS / ' + counter + '/' + totalElements);
                console.log(html);
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

//double_dns(res);