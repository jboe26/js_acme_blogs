// Function 1

function createElemWithText(elemType = "p", textContent = "", className) {
    const element = document.createElement(elemType);
    element.textContent = textContent;
    if (className) {
        element.className = className;
    }
    return element;
}

// Function 2

function createSelectOptions(users) {
    if (!users) return undefined;
    const options = [];
    for (let user of users) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }
    return options;
}
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        const options = createSelectOptions(users);
        const selectElement = document.createElement("select");
        options.forEach(option => selectElement.appendChild(option));
        document.body.appendChild(selectElement);
    });

// Function 3

function toggleCommentSection(postId) {
    if (!postId) return undefined;
    const section = document.querySelector(`section[data-post-id='${postId}']`);
    if (!section) return null;
    section.classList.toggle('hide');
    return section;
}

// Function 4

function toggleCommentButton(postId) {
    if (!postId) return undefined;
    const button = document.querySelector(`button[data-post-id='${postId}']`);
    if (button) {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    }
    return button;
}

// Function 5

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof HTMLElement)) return undefined;
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
    return parentElement;
}

// Function 6

function addButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.addEventListener('click', event => toggleComments(event, postId));
        }
    });
    return buttons;
}

// Function 7

function removeButtonListeners() {
    const buttons = document.querySelectorAll('main button');
    buttons.forEach(button => {
        const postId = button.dataset.postId;
        if (postId) {
            button.removeEventListener('click', event => {
                toggleComments(event, postId);
            });
        }
    });
    return buttons;
}
function toggleComments(event, postId) {

    console.log(`Toggled comments for postId: ${postId}`);
}

// Function 8 

function createComments(comments) {
    const fragment = document.createDocumentFragment();
    comments.forEach(comment => {
        const article = document.createElement('article');
        const h3 = createElemWithText('h3', comment.name);
        const bodyPara = createElemWithText('p', comment.body);
        const emailPara = createElemWithText('p', `From: ${comment.email}`);
        article.append(h3, bodyPara, emailPara);
        fragment.appendChild(article);
    });
    return fragment;
}
fetch('https://jsonplaceholder.typicode.com/comments')
    .then(response => response.json())
    .then(comments => {
        const commentFragment = createComments(comments);
        document.body.appendChild(commentFragment);
    });

// Function 9

function populateSelectMenu(users) {
    const selectMenu = document.getElementById('selectMenu');
    const options = createSelectOptions(users);
    options.forEach(option => {
        selectMenu.appendChild(option);
    });
    return selectMenu;
}
fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .then(users => {
        const selectMenu = populateSelectMenu(users);
        console.log(selectMenu);
    });

// Function 10

async function getUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function 11

async function getUserPosts(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
}

// Function 12

async function getUser(userId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function 13

async function getPostComments(postId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching post comments:', error);
    }
}

// Function 14

async function displayComments(postId) {
    const section = document.createElement('section');
    section.dataset.postId = postId;
    section.classList.add('comments', 'hide');
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.appendChild(fragment);
    return section;
}

// Function 15

async function createPosts(posts) {
    const fragment = document.createDocumentFragment();

    for (let post of posts) {
        const article = document.createElement('article');
        const h2 = createElemWithText('h2', post.title);
        const bodyPara = createElemWithText('p', post.body);
        const idPara = createElemWithText('p', `Post ID: ${post.id}`);
        const author = await getUser(post.userId);
        const authorPara = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
        const companyCatchPhrase = createElemWithText('p', author.company.catchPhrase);
        const button = createElemWithText('button', 'Show Comments');
        button.dataset.postId = post.id;
        const section = await displayComments(post.id);
        article.append(h2, bodyPara, idPara, authorPara, companyCatchPhrase, button, section);
        fragment.appendChild(article);
    }

    return fragment;
}

// Function 16

async function displayPosts(posts) {
    const main = document.querySelector('main');
    const element = posts && posts.length ? await createPosts(posts) : createElemWithText('p', 'Select an option to display content');
    main.appendChild(element);
    return element;
}

// Function 17

function toggleComments(event, postId) {
    event.target.listener = true;
    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}

// Function 18

async function refreshPosts(posts) {
    const removeButtons = removeButtonListeners();
    const main = deleteChildElements(document.querySelector('main'));
    const fragment = await displayPosts(posts);
    const addButtons = addButtonListeners();
    return [removeButtons, main, fragment, addButtons];
}

// Function 19

async function selectMenuChangeEventHandler(event) {
    const selectMenu = event.target;
    selectMenu.disabled = true;
    const userId = event.target.value || 1;
    const posts = await getUserPosts(userId);
    const refreshPostsArray = await refreshPosts(posts);
    selectMenu.disabled = false;
    return [userId, posts, refreshPostsArray];
}

// Function 20

async function initPage() {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
}

// Function 21

function initApp() {
    initPage();
    const selectMenu = document.getElementById('selectMenu');
    selectMenu.addEventListener('change', selectMenuChangeEventHandler);
}

document.addEventListener('DOMContentLoaded', initApp);
