import appstate from '../../state/appstate.js';
import browserUrlState from '../../state/url.js';

// Define behavior of HTML elements
let searchArticlesFocused = false;
const searchArticle = document.getElementById('searchArticles')
searchArticle.addEventListener('click', function () {
    var prefix = document.getElementById('prefix').value;
    // Do not initiate the same search if it is already in progress
    if (appstate.search.prefix === prefix && !/^(cancelled|complete)$/.test(appstate.search.status)) return;
    document.getElementById('welcomeText').style.display = 'none';
    document.querySelector('.kiwix-alert').style.display = 'none';
    document.getElementById('searchingArticles').style.display = '';
    browserUrlState.pushBrowserHistoryState(null, prefix);
    // Initiate the search
    searchDirEntriesFromPrefix(prefix);
    $('.navbar-collapse').collapse('hide');
    document.getElementById('prefix').focus();
    // This flag is set to true in the mousedown event below
    searchArticlesFocused = false;
});
searchArticle.addEventListener('mousedown', function () {
    // We set the flag so that the blur event of #prefix can know that the searchArticles button has been clicked
    searchArticlesFocused = true;
});

export default {};
