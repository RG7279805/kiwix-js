/**
 * Changes the URL of the browser page, so that the user might go back to it
 *
 * @param {String} title
 * @param {String} titleSearch
 */
function pushBrowserHistoryState (title, titleSearch) {
    var stateObj = {};
    var urlParameters;
    var stateLabel;
    if (title && !(title === '')) {
        // Prevents creating a double history for the same page
        if (history.state && history.state.title === title) return;
        stateObj.title = title;
        urlParameters = '?title=' + title;
        stateLabel = 'Wikipedia Article : ' + title;
    } else if (titleSearch && !(titleSearch === '')) {
        stateObj.titleSearch = titleSearch;
        urlParameters = '?titleSearch=' + titleSearch;
        stateLabel = 'Wikipedia search : ' + titleSearch;
    } else {
        return;
    }
    window.history.pushState(stateObj, stateLabel, urlParameters);
}

export default { pushBrowserHistoryState: pushBrowserHistoryState };
