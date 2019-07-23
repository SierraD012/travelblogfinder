// This is the CLIENT! Actual scraping does not happen here

var app = window.angular.module('tbfApp', []);
const SERVER_ADDR = "http://18.217.48.32";  //CHANGE THIS EVERY TIME YOU RESTART EC2 INSTANCE
const SERVER_PORT = ":8080";

app.controller('tbfCtrl', ['$scope', function($scope) {   // you can call functions in here from the html page by using stuff like "ng-submit='fnName(param)' "
    console.log("TBFCTRL(): starting");
                         
    $scope.allBlogPosts = []; // since this is in the scope, we can access this outside on the html 
    // TODO
    // Scope is getting data correctly. we're ready to display but they're not showing up for some reason
    // Let's mock up a post or two in allBlogPosts[] and focus on making the data display on the homepage
    
    // Call this on page load - get initial/existing blog posts from server
    $scope.getBlogData = function() {
        console.log(">GetBlogData(): starting");
        
        // Get existing posts from server
         $.get(SERVER_ADDR + SERVER_PORT + "/getPosts", function(serverResponse) {  //TODO: this ip will change every time we start the page, I should fix the ec2 instance settings
            console.log('>GetBlogData(): got response from server'); //, serverResponse);  
            updateScopeBlogData(serverResponse, $scope);
            console.log(">GetBlogData(): done, allBlogPosts length now= " + $scope.allBlogPosts.length);
        });
    };
    $scope.getBlogData(); // calls on page load! ********
    
    // Call this only when user clicks Refresh button, it's an expensive call
    $scope.refreshBlogData = function() {
        console.log(">RefreshBlogData(): starting");
        
        // Ask server to re-scrape blogs and return brand new data
        $.get(SERVER_ADDR + SERVER_PORT + "/refreshPosts", function(serverResponse) {
            console.log('>RefreshBlogData(): got response from server'); //, serverResponse);  
            updateScopeBlogData(serverResponse, $scope);
            console.log(">RefreshBlogData(): done, allBlogPosts length now= " + $scope.allBlogPosts.length);
        });
    };
    
    //Any other server GETs/POSTs should go here
    
}]); //end controller


// Replaces the existing blog post data with the new data from server 
function updateScopeBlogData (serverResponse, $scope) { //doublecheck if passing the scope outside the controller is dumb or not
    var newBlogData = JSON.parse(serverResponse);
    $scope.allBlogPosts = [];
    
    //update scope with new data - test this!
    for (let entry in newBlogData) {
         $scope.allBlogPosts.push(entry);
    }
}

//Replaces the <blogPost> tag with the code inside "template"
app.directive('blogPost', function blogPostDirective() {
  return {
    scope: {
      post: '='
    },
    restrict: 'E', //Element - forces the directive code to be used like a normal html tag, i.e. <directive></directive>
    replace: 'true',
    template: (
        //replace this with the code that works to show the blogPostData contents - which I still need to write
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

