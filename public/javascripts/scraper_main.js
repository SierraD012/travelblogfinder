// Scraper_Main: pulls data from given URL into an array to be sent to scraper_parse

// Constants
const parseBlogData = require('./scraper_parse');
const util = require('util')
const puppeteer = require('puppeteer');
const $ = require('cheerio'); 


angular.module('appUserList', [])  
.controller('tbfCtrl', ['$scope', function($scope) {   // you can call functions in here from the html page by using stuff like "ng-submit='fnName(param)' "
    console.log("TBFCTRL(): starting");
                         
    $scope.allPostData = []; // since this is in the scope, we can access this outside on the html 
    
    
    // we should call this first thing when the page loads, and also whenver the user clicks "Refresh" btn
    $scope.getBlogData = function() {
        console.log(">GetBlogData(): starting");
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
        console.log(">GetBlogData(): done");
    };
    
    
    // Pulls HTML from site and calls individual parse functions for each one
    // need to test how tbfCtrl affects the async stuff
    async function blogScraper(url, blogIndex) {
        console.log(">BlogScraper(): starting");
        
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
    

}]) //end controller


//Replaces the <blogPost> tag with the code inside "template"
.directive('blogPost', function blogPostDirective() {
  return {
    scope: {
      post: '='
    },
    restrict: 'E', //Element - forces the directive code to be used like a normal html tag, i.e. <directive></directive>
    replace: 'true',
    template: (
        //replace this with the code that works to show the blogPostData contents
      '<li class="list-group-item">' +
         '<div class="col-sm-3">' + 
            '<img ng-src="{{user.avatarUrl}}" class="img-circle" width="80px"/>' +
                '</div>' +
                  '<div class="col-sm-9">' +
                      '<span class="name">{{user.name}}</span><br/>' +
                      '<span class="email">{{user.email}}</span><br/>' +
                      '<span class="glyphicon glyphicon-map-marker text-muted c-info"></span>' +
                      '<span class="glyphicon glyphicon-earphone text-muted c-info"></span>' +
                      '<span class="fa fa-comments text-muted c-info"></span>' +
                  '</div>' +
              '</li>'
    ),
    link: linkDefaultImage
  };
  
  
  //check if the blogPost was unable to find an image for some reason, if so just use a default image
  function linkDefaultImage (scope) {
    if (!scope.post.imgURL) {
      scope.post.imgURL = 'https://www.drupal.org/files/issues/default-avatar.png';
    }
  }
});  //end directive




// Simple pause function, mainly for testing
async function pause(time){
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
      });
    let result = await promise;
}