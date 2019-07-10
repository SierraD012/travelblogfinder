// Scraper_Main: pulls data from given URL into an array to be sent to scraper_parse

// Constants
const parseBlogData = require('./scraper_parse');
const util = require('util')
const puppeteer = require('puppeteer');
const $ = require('cheerio'); 
//const reqProm = require('request-promise');


angular.module('appUserList', [])  //getting this error on old 260 projects as well so it's probably ok 
.controller('tbfCtrl', tbfCtrl);


// Calls scraping loop, holds scraped data
function tbfCtrl($scope) {   // you can call functions in here from the html page by using stuff like "ng-submit='fnName(param)' "
    console.log(">Scrape_Main: tbfCtrl(): starting");
                         
    $scope.allPostData = []; // since this is in the scope, we can access this outside on the html 
    
    
    // we should call this first thing when the page loads, and also whenver the user clicks "Refresh" btn
    $scope.getBlogData = function() {
        // 4 blog sites, we scrape data from 6 posts on each one
        // So we have data from 24 posts max
        const scrapeURLs = ["https://www.passionpassport.com", "https://www.danflyingsolo.com/travel-blog/",
                        "https://mylifesamovie.com/category/popular/", "https://abrokenbackpack.com/category/travel/"];
        
        blogScraper(scrapeURLs[0], 0); // these first two scrapers are working
        blogScraper(scrapeURLs[1], 1);
        //blogScraper(scrapeURLs[2], 2);
        //blogScraper(scrapeURLs[3], 3);
        
        /* //this is a nicer way to do it
        //for (i in scrapeURLs){ 
        //   blogScraper(scrapeURLs[i], i);
        //} */
    };

    
    
    // Pulls HTML from site and calls individual parse functions for each one
    // need to test how tbfCtrl affects the async stuff
    async function blogScraper(url, blogIndex) {
        console.log(">Scrape_Main: blogScraper(): starting");
        
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            let htmlContent = await page.content();
            console.log(">blogScraper(): got content successfully");
    
            var blogPostData = await parseBlogData(htmlContent, blogIndex);
            //put result of parse() into allPostData[] here, since here is the only place we know parse() is finished
            await deliverBlogData(blogPostData);
        } catch (err) {
            console.log(">blogScraper(): ERROR: " + err);
            //handle error
        }
    }
    
    // Given an array of data objects parsed from a blog site, 
    // adds the contents of the array to the main data collector, allPostdata[]
    async function deliverBlogData(data) {
        for (let entry in data) {
            $scope.allPostData.push(entry);
        }
        console.log(">Scrape_Main: deliverBlogData(): done, allPostData length now= " + $scope.allPostData.length);
    }
    
    
}


// Simple pause function, mainly for testing
async function pause(time){
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
      });
    let result = await promise;
}