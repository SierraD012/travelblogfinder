// Called by server with HTML data to parse

var exports = module.exports = {};

// Constants
const util = require('util')
const $ = require('cheerio');
const puppeteer = require('puppeteer');
const MAX_POSTS_PER_BLOG = 6; 
const blogURLs = ["https://www.passionpassport.com", "https://www.danflyingsolo.com/travel-blog/"];
                //"https://mylifesamovie.com/category/popular/", "https://abrokenbackpack.com/category/travel/"];
var allBlogData = []; //collect all blog post data here to return to server

// Called by server - uses scrapeSingleBlog to get data from all blogURLs,
// returns it in an easily-JSON-able array of maps
exports.getBlogPosts = async function() {
    console.log(">>BlogScraper: getBlogPosts() called");
    
    // 4 blog sites, we scrape data from 6 posts on each one - So we have data from 24 posts max
    
    // Scrape every blog in blogURLs[]
    let scraperPromises = [];
    for (let i = 0; i < blogURLs.length; i++){
      scraperPromises[i] = new Promise(function (resolve, reject) {
          resolve( scrapeSingleBlog(blogURLs[i], i) );
      });
    }
    
    await Promise.all(scraperPromises)
    //.then(response => console.log("\t>> All Promises resolved successfully"))
    .catch(error => console.log("\t>> One Promise had an error:" + error));
    
    console.log(">>BlogScraper: getBlogPosts() done, allBlogData LEN= " + allBlogData.length);
    return allBlogData;
};


// ** ASYNC! - Pulls HTML from site and calls individual parse functions for each one
//now also puts the data it got into allBlogData!
async function scrapeSingleBlog(blogURL, blogIndex) {
    console.log("\t>ScrapeSingleBlog(): starting");
    
    var scrapedBlogData; 
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(blogURL);
        let htmlContent = await page.content();
        console.log("\t>ScrapeSingleBlog(): got page content successfully");

        scrapedBlogData = await parseBlogData(htmlContent, blogIndex);
    } catch (err) {
        console.log("\t>ScrapeSingleBlog(): ERROR: " + err);
        scrapedBlogData = {title:"Failed to parse blog" + blogIndex }; //need to be able to handle empty fields on frontend too
    }
    
    // if we have data overwriting each other from the scrapers, this is where we should look to solve that issue
    for (let entry of scrapedBlogData) {
        allBlogData.push(entry);
    }
    
    return allBlogData;
}



// Given string htmlcontent and int index, calls the corresponding webscraper/parser function
// each parser fn returns a array of data on 6 posts from its blog
function parseBlogData(blogHTML, index) {
    console.log("\t>ParseBlogData(): starting, index= " + index);
    
    let parsedData = []; //this represents a batch of data on 6 posts from the blog at the given index
    // we'll add all the array content to the big allBlogData array and return that array

    switch (index) {
        case 0:
            parsedData = parser0(blogHTML);
            break;
        case 1: 
            parsedData = parser1(blogHTML);
            break;
        case 2: 
            parsedData = parser2(blogHTML);
            break;
        case 3: 
            parsedData = parser3(blogHTML);
            break;
        default:
            console.log("\t>ParseBlogData(): Unexpected index: " + index);
    }
    
    console.log("\t>ParseBlogData(): done, returning parsedData w/length " + parsedData.length); 
    return parsedData;
}


// Use for blog: Passion Passport
function parser0(htmlContent) {
    console.log("\t\t>>PBD(): parser0: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { title: string, url: string, image: string }
    
        let postDiv = $('.td_module_14', htmlContent);
        for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {

            let currPost = $(postDiv[i]);   //isolate the div for 1 post

            // Get post title, URL, and image URL
            let title = currPost.find(".entry-title");
            
            let postURL = currPost.find("a").attr('href');
            
            let imgURL = currPost.find(".entry-thumb").attr('src');

            // Assemble the post data into an object and add it to postBatch for return
            let postData = { 
                "title": title.text(),
                "url": postURL,
                "image": imgURL
            };
            postBatch[i] = postData;
        }
        
        console.log("\t\t>>PBD(): parser0: done, " ); // postbatch= " + util.inspect(postBatch));
        return postBatch; 
}

// Use for blog: Dan Flying Solo
function parser1(htmlContent) {
    console.log("\t\t>>PBD(): parser1: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { title: string, url: string, image: string }
    
    let postDiv = $(".av-masonry-item-with-image", htmlContent); //get array of all posts
    for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {
           let currPost = $(postDiv[i]);   //isolate the div for 1 post

          // Get post title, URL, and image URL
            let title = currPost.find(".av-masonry-entry-title").text();

            let postURL = currPost.attr('href');
           
            let imgURL = $(".av-masonry-image-container", currPost).attr('style');
            let imgURLArr = imgURL.split("(", 2); //cut off the opening paren 
            imgURL=imgURLArr[1].split(")", 2)[0]; //cut off the closing paren  - this is a really dumb way to do it


            // Assemble the post data into an object and add it to postBatch for return
            let postData = { 
                "title": title,
                "url": postURL,
                "image": imgURL
            };
            postBatch[i] = postData;
    }
    
    console.log("\t\t>>PBD(): parser1: done");  // , postBatch= " +  util.inspect(postBatch));
    return postBatch;
}

// Use for blog: My Life's a Movie
function parser2(htmlContent) {
    console.log("\t\t>>PBD(): parser2: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { title: string, url: string, image: string }
    
    // let postDiv = ""; //$('.td_module_14', htmlContent);
    // for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {
    //       // Get post title, URL, and image URL
    //         let title = "";
    //         let postURL = "";
    //         let imgURL = "";



    //         // Assemble the post data into an object and add it to postBatch for return
    //         let postData = { 
    //             "title": title.text(),
    //             "url": postURL,
    //             "image": imgURL
    //         };
    //         postBatch[i] = postData;
    // }
    
    console.log("\t\t>>PBD(): parser2: done");  // , postBatch= " +  util.inspect(postBatch));
    return postBatch; 
}

// Use for blog: A Broken Backpack
function parser3(htmlContent) {
    console.log("\t\t>>PBD(): parser3: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { title: string, url: string, image: string }
    
    // let postDiv = ""; //$('.td_module_14', htmlContent);
    // for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {
    //       // Get post title, URL, and image URL
    //         let title = "";
    //         let postURL = "";
    //         let imgURL = "";



    //         // Assemble the post data into an object and add it to postBatch for return
    //         let postData = { 
    //             "title": title.text(),
    //             "url": postURL,
    //             "image": imgURL
    //         };
    //         postBatch[i] = postData;
    // }
    
    console.log("\t\t>>PBD(): parser3: done"); // , postBatch= " +  util.inspect(postBatch));
    return postBatch;
}

