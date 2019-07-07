// Scraper_Main: pulls data from given URL into an array to be sent to scraper_parse


// Constants
const parseBlogData = require('./scraper_parse');

const util = require('util')
const puppeteer = require('puppeteer');
const $ = require('cheerio'); 
//const reqProm = require('request-promise');
const scrapeURLs = ["https://www.passionpassport.com", "https://www.danflyingsolo.com/travel-blog/",
                    "https://mylifesamovie.com/category/popular/", "https://abrokenbackpack.com/category/travel/"];
var allPostData = []; //data from all posts/all blogs is put in here by getBlogData()
 
// Control flow starts here
main();

// Initializes URLs, calls scraping loop 
/*
For each URL
1. pull HTML from URL
2. send html content to scraper_parse, along with which index it was in the array
3. use index to call the correct parsing function - 
4. pull out blogpost title + other data, package up as map or JSON
5. print out for now - later, send back to client to display
*/

function main() {
    console.log(">Scrape_Main: starting");
     
    // 4 blog sites, we scrape data from 6 posts on each one
    // So we have data from 24 posts max
   
    getBlogData(scrapeURLs[0], 0);
    getBlogData(scrapeURLs[1], 1);
    getBlogData(scrapeURLs[2], 2);
    getBlogData(scrapeURLs[3], 3);
    
}


// Pulls HTML from site and calls individual parse functions for each one
async function getBlogData(url, blogIndex) {
    console.log(">Scrape_Main: getBlogData(): starting");
    
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let htmlContent = await page.content();
        console.log(">getBlogData(): got content successfully");

        var blogPostData = await parseBlogData(htmlContent, blogIndex);
        //put result of parse() into allPostData[] here, since here is the only place we know parse() is finished
        await deliverBlogData(blogPostData);
    } catch (err) {
        console.log(">getBlogData(): ERROR: " + err);
        //handle error
    }
}

// Given an array of data objects parsed from a blog site, 
// adds the contents of the array to the main data collector, allPostdata[]
async function deliverBlogData(data) {
    
    for (let entry in data) {
        allPostData.push(entry);
    }
    
    console.log(">Scrape_Main: deliverBlogData(): done, allPostData length now= " + allPostData.length);
}

// simple pause function, mainly for testing
async function pause(time){
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
      });
    let result = await promise;
}