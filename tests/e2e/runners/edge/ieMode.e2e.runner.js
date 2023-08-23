import { Builder } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/ie.js';
import legacyRayCharles from '../../specs/legacy-ray_charles.e2e.spec.js';
import gutenbergRo from '../../specs/gutenberg_ro.e2e.spec.js';

/* eslint-disable camelcase */

async function loadIEModeDriver () {
    const ieOptions = new Options();
    ieOptions.setEdgeChromium(true);
    ieOptions.setEdgePath('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe');
    const driver = await new Builder()
        .forBrowser('ie')
        .setIeOptions(ieOptions)
        .build();
    return driver;
};

legacyRayCharles.runTests(await loadIEModeDriver());
gutenbergRo.runTests(await loadIEModeDriver(), ['jquery']);