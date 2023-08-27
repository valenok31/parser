const randomUseragent = require('random-useragent');
const puppeteer = require('puppeteer-extra');
const XLSX = require('xlsx');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(AdblockerPlugin({blockTrackers: true}))


let link = 'https://www.dns-shop.ru/catalog/88a69658505f4e77/irrigatory/?stock=now-today-tomorrow&p=';

(async () => {
    let start = Date.now();
    let flag = 2;
    let res = [];
    let counter = 1;
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


    while (!!flag) {
        await page.goto(`${link}${counter}`);

        await page.waitForSelector('div.ui-button-widget', {timeout: 2000})
            .then(async () => {
                let html = await page.evaluate(async () => {
                    let page = [];
                    let divs = document.querySelectorAll('div.ui-button-widget');
                    divs.forEach(div => {
                        let a = div.querySelector('a.ui-link');
                        let obj = {href: a.href};
                        page.push(obj);
                    })
                    return page;
                }, {waitUntil: 'load'});
                res = res.concat(html);
                console.log('SUCCESS / ' + counter + ' / ' + html.length);
                counter++;
            }).catch(e => {
                flag--;
                console.log('== FALSE ==');
            });
    }


    /*
        let binaryWS = XLSX.utils.json_to_sheet(res);
        let wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, binaryWS, 'Noutbuki')
        XLSX.writeFile(wb, 'DNS_shop.xlsx');*/

    await browser.close()
    let end = Date.now();
    console.log(res.length + 'шт за ' + (end - start) / 1000 + ' сек');
    await double_dns(res);
})();


let double_dns = async (arrSecondRounds) => {
    let start = Date.now();
    let flag = 4;
    let res = [];
    let counter = 0;
    let arrSecondRound = arrSecondRounds;
    let totalElements = arrSecondRound.length;
    let errT = 0;


    let type = 'Ирригатор';


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

        await page.waitForSelector('div.product-card-description-text', {timeout: 2000})
            .then(async () => {

                let html = await page.evaluate(async () => {
                    let child = document.querySelector('div.product-characteristics-content').childNodes;
                    let page = [];

                    let article = document.querySelector('div.product-card-top__code').innerText;
                    article = article.slice(12);
                    let name = document.querySelector('a.product-card-tabs__product-title').innerText;
                    let name2 = document.querySelector('div.product-card-top__specs').innerText.slice(0, -10)
                    let price = document.querySelector('div.product-buy__price').innerText.split('₽')[0].slice(0, -1);
                    let brand = document.querySelector('img.product-card-top__brand-image').alt;
                    let Annotation = document.querySelector('div.product-card-description-text').innerText;
                    let mainImg = document.querySelector('img.product-images-slider__main-img').src;
                    let remains = document.querySelector('div.order-avail-wrap').innerText;
                    child = document.querySelector('div.product-characteristics-content').childNodes;

                    let obj = {


                        '№': '',
                        'Артикул*': article,
                        'Название товара': name + ', ' + String(name2),
                        'Цена, руб.*': price,
                        'Цена до скидки, руб.': '',
                        'НДС, %*': 'Не облагается',
                        'Включить продвижение': '',
                        'Ozon ID': '',
                        'Коммерческий тип*': 'Ирригаторы, жидкости и насадки для ирригаторов',
                        'Штрихкод (Серийный номер / EAN)': '',
                        'Вес в упаковке, г*': '',
                        'Ширина упаковки, мм*': '',
                        'Высота упаковки, мм*': '',
                        'Длина упаковки, мм*': '',
                        'Ссылка на главное фото*': mainImg,//+
                        'Ссылки на дополнительные фото': '',
                        'Ссылки на фото 360': '',
                        'Артикул фото': '',
                        'Бренд*': brand, //+
                        'Название модели*': name + ', ' + String(name2),//+
                        'Единиц в одном товаре*': '',
                        'Емкость резервуара': '',//+
                        'Цвет товара': '',
                        'Название цвета': '',
                        'Количество в упаковке, шт': '',
                        'Объем, мл': '',
                        'Тип*': 'Ирригатор',
                        'Размер упаковки (Длина х Ширина х Высота), см': '',
                        'Комплектация': '',
                        'Область использования': '',
                        'Срок годности в днях': '',
                        'Гарантийный срок': '',
                        'Для беременных или новорожденных': '',
                        'Класс опасности товара': '',
                        'Питание': '',//+
                        'Rich-контент JSON': '',
                        'Особенности ирригатора': '',
                        'Конструкция ирригатора': '',
                        'Тип ирригатора': '',
                        'Минимальное давление воды': '', //+
                        'Максимальное давление воды': '',//+
                        'Регулировка давления струи': '',
                        'Минимальный возраст ребенка': '',
                        'Максимальный возраст ребенка': '',
                        'Пол ребенка': '',
                        'ТН ВЭД коды ЕАЭС': '',
                        'Название серии': '',
                        'Аннотация': Annotation,
                        'Общее количество насадок в комплекте': '',//+
                        'Ключевые слова': '',
                        'Количество пульсаций': '', //+
                        'Размеры, мм': '',
                        'Вид насадки зубной щетки, ирригатора': '',
                        'Принцип подачи струи воды': '', //+
                        'Возрастные ограничения': '',
                        'Целевая аудитория': '',
                        'Длина шнура питания, м': '',
                        'Применение': '',
                        'Кол-во батарей, шт': '',
                        'Время автономной работы ирригатора': '', //+
                        'Страна-изготовитель': '',//+
                        'Количество режимов давления воды': '', //+
                        'Количество заводских упаковок': '1',//+
                        'Ошибка': '',
                        'Предупреждение': '',

                        'Остатки': remains,


                    };
                    let rk = 1;
                    for (let k = 0; k < child.length; k++) {
                        for (let i = 1; i < child[k].childNodes.length; i++) {
                            let title = child[k]?.childNodes[i]?.childNodes[0].innerText.trim();
                            let value_child = child[k]?.childNodes[i]?.childNodes[1].innerText.trim();

                            if (title == 'Мощность' || title == 'Длина' || title == 'Ширина' || title == 'Высота' || title == 'Толщина' || title == 'Глубина') {
                                value_child = value_child.slice(0, -3)
                            }
                            if (title == 'Длина сетевого шнура') {
                                title = 'Длина шнура, м';
                                value_child = value_child.slice(0, -2)
                            }

                            if (title == 'Раскладка клавиатуры') {
                                title = title + rk;
                                rk = 2
                            }

                            if (title == 'Подача холодного воздуха' && value_child == 'есть') {
                                obj['Дополнительные режимы'] = 'Холодный воздух';
                            }

                            if (title == 'Код производителя') {
                                title = 'Партномер';
                                value_child = value_child.slice(1, -1)
                            }

                            if (title.indexOf('Гарантия') !== -1) {
                                title = 'Гарантийный срок'
                            }
                            if (title == 'Основной цвет' || title == 'Цвет верхней крышки') {
                                title = 'Цвет товара';
                            }
                            if (title == 'Страна-производитель') {
                                title = 'Страна-изготовитель';
                            }

                            if (title == 'Материал корпуса') {
                                title = 'Основной материал корпуса';
                            }
                            if (title == 'Тип подключения') {
                                title = 'Тип соединения';
                            }

                            if (value_child == 'нет') {
                                value_child = ''
                            }

                            obj[title] = value_child;
                        }
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
                XLSX.utils.book_append_sheet(wb, binaryWS, '1')
                XLSX.writeFile(wb, `${type}_${totalElements}.xlsx`);

                console.log('SUCCESS / ' + counter + '/' + totalElements);


            }).catch(e => {
                console.log('== FALSE ==');
                errT++

                if (errT > 5) {
                    console.log('ERROR=' + counter);
                    errT = 0;
                    counter++
                }
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