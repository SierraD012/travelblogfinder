// Called by scraper_main with HTML data to parse

// Constants
const util = require('util')
const $ = require('cheerio');
const reqProm = require('request-promise');
const puppeteer = require('puppeteer');
const MAX_POSTS_PER_BLOG = 6; //temp - set back to 6

// Given string htmlcontent and int index, calls the corresponding webscraper/parser function
// each parser fn returns a array of data on 6 posts from its blog
const parseBlogData = function(htmlContent, index) {
    console.log("\t>ParseBlogData(): starting, index= " + index);
    
    let blogData = []; //this represents a batch of data on 6 posts from the blog at the given index
    // we'll return this array to scraper_main and it'll add all the array content to the big allBlogData array
    // we'll eventually select 8 random blog posts from allBlogData and display just those 8 posts
    
    switch (index) {
        case 0:
            blogData = parser0(htmlContent);
            break;
        case 1: 
            blogData = parser1(htmlContent);
            break;
        case 2: 
            blogData = parser2(htmlContent);
            break;
        case 3: 
            blogData = parser3(htmlContent);
            break;
        default:
            console.log("\t>ParseBlogData(): Unexpected index: " + index);
    }
    
    console.log("\t>ParseBlogData(): done, returning blogData w/length " + blogData.length); 
    return blogData;
};


// Use for blog: Passion Passport
function parser0(htmlContent) {
    console.log("\t\t>>PBD(): parser0: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { [title: string], [url: string], [image: string] }
    
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
        
        console.log("\t\t>>PBD(): parser0: done, postBatch= " +  util.inspect(postBatch));
        return postBatch; 
}

// Use for blog: Dan Flying Solo
function parser1(htmlContent) {
    console.log("\t\t>>PBD(): parser1: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { [title: string], [url: string], [image: string] }
    
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
    
    console.log("\t\t>>PBD(): parser1: done, postBatch= " +  util.inspect(postBatch));
    return postBatch;
}


// Use for blog: My Life's a Movie
function parser2(htmlContent) {
    console.log("\t\t>>PBD(): parser2: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { [title: string], [url: string], [image: string] }
    
    let postDiv = ""; //$('.td_module_14', htmlContent);
    for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {
          // Get post title, URL, and image URL
            let title = "";
            let postURL = "";
            let imgURL = "";



            // Assemble the post data into an object and add it to postBatch for return
            let postData = { 
                "title": title.text(),
                "url": postURL,
                "image": imgURL
            };
            postBatch[i] = postData;
    }
    
    console.log("\t\t>>PBD(): parser2: done, postBatch= " +  util.inspect(postBatch));
    return postBatch; 
}


// Use for blog: A Broken Backpack
function parser3(htmlContent) {
    console.log("\t\t>>PBD(): parser3: starting");
    let postBatch = []; //postBatch[] holds 6 Maps with structure: { [title: string], [url: string], [image: string] }
    
    let postDiv = ""; //$('.td_module_14', htmlContent);
    for (let i = 0; i < MAX_POSTS_PER_BLOG; i++) {
          // Get post title, URL, and image URL
            let title = "";
            let postURL = "";
            let imgURL = "";



            // Assemble the post data into an object and add it to postBatch for return
            let postData = { 
                "title": title.text(),
                "url": postURL,
                "image": imgURL
            };
            postBatch[i] = postData;
    }
    
    console.log("\t\t>>PBD(): parser3: done, postBatch= " +  util.inspect(postBatch));
    return postBatch;
}

module.exports = parseBlogData; //important - this allows scraper_main to be able to see this fn

