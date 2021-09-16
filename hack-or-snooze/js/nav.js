"use strict";



function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage("all");
}

$body.on("click", "#nav-all", navAllStories);



function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);



function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $loggedInNav.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $loginForm.hide();
  $signupForm.hide();
}

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  hidePageComponents();
  $submitStoryForm.show();
  putStoriesOnPage("all");
}

$navSubmit.on("click", navSubmitClick);

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putStoriesOnPage("favorites");
}

$navFavorites.on("click", navFavoritesClick);


function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick");
  hidePageComponents();
  putStoriesOnPage("userStories");
}

$navMyStories.on("click", navMyStoriesClick);
