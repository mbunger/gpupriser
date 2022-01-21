const axios = require('axios');
const { JSDOM } = require('jsdom');

const getPriceUrl = (product_name) => `https://www.pricerunner.dk/cl/37/Grafikkort?q=${product_name}`;
const getScoreUrl = () => `https://www.videocardbenchmark.net/high_end_gpus.html`;

// Idea https://www.youtube.com/watch?v=XTAYT37UuEY&ab_channel=CodingGarden
async function getPrices(product_name) {
    const productUrl = getPriceUrl(product_name);
    const { data: html } = await axios.get(productUrl, {
        // Mimic browser headers
        headers: {
            Accept: 'hej'
        }
    });
    const dom = new JSDOM(html);
    console.log(dom.window.document.querySelector('.SnarOLmYcb Ci0mGVkzmW CoU3uHMRiq css-1msxq8e').textContent)
}

getPrices('GeForce GTX 1660 SUPER');