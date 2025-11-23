const { remote } = require('webdriverio');

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android',
    'appium:udid': 'RZCX222T8KY',
    'appium:appPackage': 'com.snapchat.android',
    'appium:appActivity': 'com.snap.mushroom.MainActivity',
    'appium:appWaitActivity': '*',
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
};

const wdOpts = {
    hostname: 'localhost',
    port: 4723, // Fixed: Using standard Appium port
    logLevel: 'error',
    capabilities,
};

async function run() {
    const driver = await remote(wdOpts);
    try {
        console.log('Connected to device.');

        // Wait a bit for the app to load/stabilize
        await driver.pause(5000);

        console.log('Dumping page source...');
        const source = await driver.getPageSource();
        console.log(source);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await driver.deleteSession();
    }
}

run();
