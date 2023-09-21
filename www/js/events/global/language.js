import translateUI from '../../lib/translateUI.js';
import uiUtil from '../../lib/uiUtil.js';

/**
 * @param {Object} params - Global options
 */
function getDefaultLanguageAndTranslateApp (params) {
    console.log(params);
    var defaultBrowserLanguage = uiUtil.getBrowserLanguage();
    // DEV: Be sure to add supported language codes here
    // TODO: Add a supported languages object elsewhere and use it here
    if (!params.overrideBrowserLanguage) {
        if (/^en|es|fr$/.test(defaultBrowserLanguage.base)) {
            console.log('Supported default browser language is: ' + defaultBrowserLanguage.base + ' (' + defaultBrowserLanguage.locale + ')');
        } else {
            console.warn('Unsupported browser language! ' + defaultBrowserLanguage.base + ' (' + defaultBrowserLanguage.locale + ')');
            console.warn('Reverting to English');
            defaultBrowserLanguage.base = 'en';
            defaultBrowserLanguage.name = 'GB';
            params.overrideBrowserLanguage = 'en';
        }
    } else {
        console.log('User-selected language is: ' + params.overrideBrowserLanguage);
    }
    // Use the override language if set, or else use the browser default
    var languageCode = params.overrideBrowserLanguage || defaultBrowserLanguage.base;
    translateUI.translateApp(languageCode)
        .catch(function (err) {
            if (languageCode !== 'en') {
                var message = '<p>We cannot load the translation strings for language code <code>' + languageCode + '</code>';
                // if (/^file:\/\//.test(window.location.href)) {
                //     message += ' because you are accessing Kiwix from the file system. Try using a web server instead';
                // }
                message += '.</p><p>Falling back to English...</p>';
                if (err) message += '<p>The error message was:</p><code>' + err + '</code>';
                uiUtil.systemAlert(message);
                document.getElementById('languageSelector').value = 'en';
                return translateUI.translateApp('en');
            }
        });
}

export default {
    getDefaultLanguageAndTranslateApp: getDefaultLanguageAndTranslateApp
}
