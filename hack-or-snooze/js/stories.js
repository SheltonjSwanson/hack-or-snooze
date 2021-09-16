"use strict";


let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage("all");
}

function generateStoryMarkup(story, trashOn) {
  

  const hostName = story.getHostName();

 
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${trashOn === "trashOn" ? makeTrashHtml(story, currentUser) : ""}
        ${showStar ? makeStarHtml(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


function makeStarHtml(story, user) {
  const isFavorite = user.isFavorite(story);
  if (isFavorite) {
    return `
    <span class="favorite">
        <i class="fas fa-star"></i>
      </span>`;
  } else {
    return `
    <span class="favorite">
        <i class="far fa-star"></i>
      </span>`;
  }
}


function makeTrashHtml(story, user) {
  if (user.ownStories.some((s) => s.storyId === story.storyId) === true) {
    return `
    <span class="trash">
      <i class="fas fa-trash-alt"></i>
    </span>
    `;
  } else {
    return ``;
  }
}



function putStoriesOnPage(stories) {
  console.debug("putStoriesOnPage");

  let storiesType;
  let trashOn = "trashOff";
  let noFavsOrStoriesText;

  if (stories === "all") {
    storiesType = storyList.stories;
  } else if (stories === "favorites") {
    storiesType = currentUser.favorites;
    noFavsOrStoriesText = `<p>You have not favorited any stories!</p>`;
  } else if (stories === "userStories") {
    storiesType = currentUser.ownStories;
    trashOn = "trashOn";
    noFavsOrStoriesText = `<p>You have not submitted any stories!</p>`;
  }

  $allStoriesList.empty();

  
  if (storiesType.length === 0) {
    $allStoriesList.append(noFavsOrStoriesText);
  }

 
  for (let story of storiesType) {
    const $story = generateStoryMarkup(story, trashOn);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function submitStoryFromForm(evt) {
  console.debug("submitStoryFromForm", evt);
  evt.preventDefault();

 
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const story = { author: author, title: title, url: url };


  const addedStory = await storyList.addStory(currentUser, story);

  
  storyList = await StoryList.getStories();
  putStoriesOnPage("all");

  $submitStoryForm.trigger("reset");
  $submitStoryForm.hide();
}

$submitStoryForm.on("submit", submitStoryFromForm);

async function favoriteStory(evt) {
  console.debug("favoriteStory");

  if (currentUser) {
    
    const storyId = evt.target.parentElement.parentElement.id;
    const story = storyList.stories.find((s) => s.storyId === storyId);

    if (evt.target.outerHTML === `<i class="far fa-star"></i>`) {
      evt.target.outerHTML = `<i class="fas fa-star"></i>`;
      await currentUser.addFavorite(currentUser.username, storyId, story);
    } else {
      evt.target.outerHTML = `<i class="far fa-star"></i>`;
      await currentUser.removeFavorite(currentUser.username, storyId, story);
    }
  }
}

$allStoriesList.on("click", ".favorite", favoriteStory);


async function deleteStory(evt) {
  console.debug("deleteStory");
  if (evt.target.outerHTML === `<i class="fas fa-trash-alt"></i>`) {
    
    const storyId = evt.target.parentElement.parentElement.id;
   
    const story = storyList.stories.find((s) => s.storyId === storyId);
    await storyList.deleteStory(currentUser, story);
    
    putStoriesOnPage("userStories");
  }
}

$allStoriesList.on("click", ".trash", deleteStory);
