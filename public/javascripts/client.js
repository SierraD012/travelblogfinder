// This is the CLIENT! Actual scraping does not happen here

var app = window.angular.module('tbfApp', []);
const SERVER_ADDR = "http://13.59.91.58";  //CHANGE THIS EVERY TIME YOU RESTART EC2 INSTANCE
const SERVER_PORT = ":8080";
const NUM_SELECTED_POSTS = 8;

app.controller('tbfCtrl', ['$scope', function($scope) {
    console.log("TBFCTRL(): starting");
            
    $scope.allBlogPosts = [];
    $scope.selectedPosts = []; // this holds 8 random posts to display

    // Call this on page load - get initial/existing blog posts from server
    $scope.getBlogData = function() {
        console.log(">GetBlogData(): starting");
        
        // Get existing posts from server
         $.get(SERVER_ADDR + SERVER_PORT + "/getPosts", function(serverResponse) {  //TODO: this ip will change every time we start the page, I should fix the ec2 instance settings
            console.log('>GetBlogData(): got posts from server '); //, serverResponse);  
            updateScopeBlogData(serverResponse, $scope);
        });
    };
    $scope.getBlogData();
    
    // Call this only when user clicks Refresh button, it's an expensive call
    $scope.refreshBlogData = function() {
        console.log(">RefreshBlogData(): starting");
        
        // Ask server to re-scrape blogs and return brand new data
        $.get(SERVER_ADDR + SERVER_PORT + "/refreshPosts", function(serverResponse) {
            console.log('>RefreshBlogData(): got response from server'); // + serverResponse);  
            updateScopeBlogData(serverResponse, $scope);  
            console.log(">RefreshBlogData(): done, allBlogPosts length now= " + $scope.allBlogPosts.length);
        });
    };
    
    //Any other server GETs/POSTs should go here
    
}]); //end controller


// Replaces the existing blog post data with the new data from server 
function updateScopeBlogData (serverResponse, $scope) {
    var newBlogData = JSON.parse(serverResponse);
    $scope.allBlogPosts = [];
    
    //update scope with new random posts and notify scope to update DOM
    $scope.$apply(function() {
        for (let entry of newBlogData) {
            $scope.allBlogPosts.push(entry);
        }
        chooseRandomPosts($scope);
    });
}

// Chooses random posts from allBlogPosts[] to display on page
function chooseRandomPosts ($scope) {
    
    $scope.selectedPosts = [];  //empty prev selection
    let blogPostOptions = JSON.parse(JSON.stringify($scope.allBlogPosts));
    //kinda slow but effective way to deep copy our array so we can remove already picked blog posts from it
    console.log("\t>>ChooseRandPosts(): starting"); //, blogPostOpts len= " + blogPostOptions.length);
    
    for (let i = 0; i < NUM_SELECTED_POSTS; i++) {
        // pick a rand post from blogPostOptions
        let randPostIdx = Math.floor(Math.random() * (blogPostOptions.length));
        //console.log("\t>>ChooseRandPosts(): *** blogPostOpts[] len= " + blogPostOptions.length + ", chose post at idx " + randPostIdx);
        $scope.selectedPosts[i] = Object.assign({}, blogPostOptions[randPostIdx]);  //shallow copy since blogPostOpts[] has no references inside objs
        //console.log("\t>>ChooseRandPosts(): preparing to splice obj: " + blogPostOptions[randPostIdx].title);
        //remove chosen blog post from blogPostOptions[]
        blogPostOptions.splice(randPostIdx, 1);
        //console.log("\t>>ChooseRandPosts(): just removed chosen post from bpO[], len now= " + blogPostOptions.length);
    }
    
    console.log("\t>>ChooseRandPosts(): done, randSelectedPosts len now= " + $scope.selectedPosts.length);
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

