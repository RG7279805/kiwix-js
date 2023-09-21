import language from './language.js'
import params from '../../state/params.js'
/**
 * Resize the IFrame height, so that it fills the whole available height in the window
 */
function resizeIFrame () {
    var headerStyles = getComputedStyle(document.getElementById('top'));
    var iframe = document.getElementById('articleContent');
    var region = document.getElementById('search-article');
    if (iframe.style.display === 'none') {
        // We are in About or Configuration, so we only set the region height
        region.style.height = window.innerHeight + 'px';
    } else {
        // IE cannot retrieve computed headerStyles till the next paint, so we wait a few ticks
        setTimeout(function () {
            // Get  header height *including* its bottom margin
            var headerHeight = parseFloat(headerStyles.height) + parseFloat(headerStyles.marginBottom);
            iframe.style.height = window.innerHeight - headerHeight + 'px';
            // We have to allow a minimum safety margin of 10px for 'iframe' and 'header' to fit within 'region'
            region.style.height = window.innerHeight + 10 + 'px';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    language.getDefaultLanguageAndTranslateApp(params);
    resizeIFrame();
});
window.addEventListener('resize', resizeIFrame);

export default { resizeIFrame: resizeIFrame }
