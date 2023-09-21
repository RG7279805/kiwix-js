'use strict';
import uiUtil from '../lib/uiUtil.js';
import translateUI from '../lib/translateUI.js';
import selectedArchive from '../state/selectedArchive.js';
import appstate from '../state/appstate.js';
import params from '../state/params.js';

/**
 * Handles the click on the title of an article in search results
 * @param {Event} event The click event to handle
 * @returns {Boolean} Always returns false for JQuery event handling
 */
function handleTitleClick (event) {
    var dirEntryId = decodeURIComponent(event.target.getAttribute('dirEntryId'));
    findDirEntryFromDirEntryIdAndLaunchArticleRead(dirEntryId);
    return false;
}


/**
 * Display the list of articles with the given array of DirEntry
 * @param {Array} dirEntryArray The array of dirEntries returned from the binary search
 * @param {Object} reportingSearch The reporting search object
 */
export function populateListOfArticles (dirEntryArray, reportingSearch) {
    // Do not allow cancelled searches to report
    if (reportingSearch.status === 'cancelled') return;
    var stillSearching = reportingSearch.status === 'interim';
    var articleListHeaderMessageDiv = document.getElementById('articleListHeaderMessage');
    var nbDirEntry = dirEntryArray ? dirEntryArray.length : 0;

    var message;
    if (stillSearching) {
        message = 'Searching [' + reportingSearch.type + ']... found: ' + nbDirEntry;
    } else if (nbDirEntry >= params.maxSearchResultsSize) {
        message = 'First ' + params.maxSearchResultsSize + ' articles found (refine your search).';
    } else {
        message = 'Finished. ' + (nbDirEntry || 'No') + ' articles found' + (
            reportingSearch.type === 'basic' ? ': try fewer words for full search.' : '.'
        );
    }

    articleListHeaderMessageDiv.textContent = message;

    var articleListDiv = document.getElementById('articleList');
    var articleListDivHtml = '';
    var listLength = dirEntryArray.length < params.maxSearchResultsSize ? dirEntryArray.length : params.maxSearchResultsSize;
    for (var i = 0; i < listLength; i++) {
        var dirEntry = dirEntryArray[i];
        // NB We use encodeURIComponent rather than encodeURI here because we know that any question marks in the title are not querystrings,
        // and should be encoded [kiwix-js #806]. DEV: be very careful if you edit the dirEntryId attribute below, because the contents must be
        // inside double quotes (in the final HTML string), given that dirEntryStringId may contain bare apostrophes
        // Info: encodeURIComponent encodes all characters except  A-Z a-z 0-9 - _ . ! ~ * ' ( )
        var dirEntryStringId = encodeURIComponent(dirEntry.toStringId());
        articleListDivHtml += '<a href="#" dirEntryId="' + dirEntryStringId +
            '" class="list-group-item">' + dirEntry.getTitleOrUrl() + '</a>';
    }

    // innerHTML required for this line
    articleListDiv.innerHTML = articleListDivHtml;
    // We have to use mousedown below instead of click as otherwise the prefix blur event fires first
    // and prevents this event from firing; note that touch also triggers mousedown
    document.querySelectorAll('#articleList a').forEach(function (link) {
        link.addEventListener('mousedown', function (e) {
            // Cancel search immediately
            appstate.search.status = 'cancelled';
            handleTitleClick(e);
            return false;
        });
    });
    if (!stillSearching) document.getElementById('searchingArticles').style.display = 'none';
    document.getElementById('articleListWithHeader').style.display = '';
}

/**
 * Search the index for DirEntries with title that start with the given prefix (implemented
 * with a binary search inside the index file)
 * @param {String} prefix The string that must appear at the start of any title searched for
 */
export function searchDirEntriesFromPrefix (prefix) {
    if (selectedArchive !== null && selectedArchive.isReady()) {
        // Cancel the old search (zimArchive search object will receive this change)
        appstate.search.status = 'cancelled';
        // Initiate a new search object and point appstate.search to it (the zimArchive search object will continue to point to the old object)
        // DEV: Technical explanation: the appstate.search is a pointer to an underlying object assigned in memory, and we are here defining a new object
        // in memory {prefix: prefix, status: 'init', .....}, and pointing appstate.search to it; the old search object that was passed to selectedArchive
        // (zimArchive.js) continues to exist in the scope of the functions initiated by the previous search until all Promises have returned
        appstate.search = { prefix: prefix, status: 'init', type: '', size: params.maxSearchResultsSize };
        var activeContent = document.getElementById('activeContent');
        if (activeContent) activeContent.style.display = 'none';
        selectedArchive.findDirEntriesWithPrefix(appstate.search, populateListOfArticles);
    } else {
        document.getElementById('searchingArticles').style.display = 'none';
        // We have to remove the focus from the search field,
        // so that the keyboard does not stay above the message
        document.getElementById('searchArticles').focus();
        uiUtil.systemAlert(translateUI.t('dialog-archive-notset-message') || 'Archive not set: please select an archive',
            translateUI.t('dialog-archive-notset-title') || 'No archive selected').then(function () {
                document.getElementById('btnConfigure').click();
            });
    }
}
