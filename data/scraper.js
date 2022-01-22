const axios = require('axios');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const getPriceUrl = (product_name) => `https://www.pricerunner.dk/cl/37/Grafikkort?q=${product_name}`;
const getScoreUrl = () => `https://www.videocardbenchmark.net/high_end_gpus.html`;
const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
const gpuList = ['GeForce GTX 1660 SUPER', 'GeForce RTX 3090', 'Radeon RX 6900 XT', 'Radeon RX 6800 XT'];

// Idea https://www.youtube.com/watch?v=XTAYT37UuEY&ab_channel=CodingGarden
async function getPrices(product_name) {
    const productUrl = getPriceUrl(product_name);
    const { data: html } = await axios.get(productUrl, {
        // Mimic browser headers
        headers: {
            authority: 'www.pricerunner.dk',
            scheme: 'https',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
        }
    });
    const dom = new JSDOM(html);
    const list = dom.window.document.querySelectorAll('.SnarOLmYcb.Ci0mGVkzmW.CoU3uHMRiq.css-1msxq8e');
    const priceList = [];
    list.forEach(price => {
        priceList.push(parseInt(price.textContent.split(" ")[0].replace('.','')));
    });
    console.log(priceList);
    return {
        min: Math.min(...priceList),
        max: Math.max(...priceList),
        avg: parseInt(average(priceList).toFixed(0)),
        time: new Date()
    }
}

async function getScore(product_name) {
    const { data: html } = await axios.get(getScoreUrl(), {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36'
        }
    });

    const dom = new JSDOM(html);
    let score;
    for (const span of dom.window.document.querySelectorAll(".prdname")) {
        if (span.textContent.includes(product_name)) {
            const nextSibling = span.nextElementSibling;
            const nextSibling2 = nextSibling.nextElementSibling;
            score = parseInt(nextSibling2.textContent.replace(',',''));
            break;
        }
    }
    return score;
}

// Load .json
// let rawdata = fs.readFileSync('data/score.json');
// const score = JSON.parse(rawdata);
// console.log(score)
getScore('GeForce GTX 1660 SUPER').then(score => {
    console.log(score);
});

// gpuList.forEach(gpu => {
//     console.log('Fetching values for: ' + gpu);
//     getPrices(gpu).then((price) => {
//         console.log('Writing file');
//         let data = JSON.stringify(price);
//         fs.writeFileSync('data/' + gpu.replaceAll(' ','') + '.json', data);
//     });
// });
