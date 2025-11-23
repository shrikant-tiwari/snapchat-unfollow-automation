const { remote } = require('webdriverio');
const fs = require('fs');

// Load environment variables (if .env file exists)
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not required if using environment variables directly
}

// Configuration
const DEVICE_ID = process.env.DEVICE_ID || 'RZCX222T8KY'; // Change to your device ID or set in .env
const APPIUM_HOST = process.env.APPIUM_HOST || 'localhost';
const APPIUM_PORT = parseInt(process.env.APPIUM_PORT || '4723');
const MAX_UNFOLLOWS = parseInt(process.env.MAX_UNFOLLOWS || '999999');
const TARGET_ROW_INDEX = parseInt(process.env.TARGET_ROW_INDEX || '4');

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android',
    'appium:udid': DEVICE_ID,
    'appium:appPackage': 'com.snapchat.android',
    'appium:appActivity': 'com.snap.mushroom.MainActivity',
    'appium:appWaitActivity': '*',
    'appium:noReset': true,
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
};

const wdOpts = {
    hostname: APPIUM_HOST,
    port: APPIUM_PORT,
    logLevel: 'error',
    capabilities,
};

// Helper function to find element with multiple strategies
async function findElementFlexible(driver, selectors, timeout = 5000) {
    for (const selector of selectors) {
        try {
            const element = await driver.$(selector);
            const exists = await element.waitForExist({ timeout: timeout / selectors.length });
            if (exists) {
                console.log(`✓ Found element using: ${selector}`);
                return element;
            }
        } catch (e) {
            console.log(`✗ Selector failed: ${selector}`);
        }
    }
    return null;
}

// Helper function to dump page source for debugging
async function dumpPageSource(driver, filename) {
    try {
        const source = await driver.getPageSource();
        fs.writeFileSync(filename, source);
        console.log(`📄 Page source dumped to: ${filename}`);
    } catch (e) {
        console.error('Failed to dump page source:', e.message);
    }
}

async function run() {
    const driver = await remote(wdOpts);
    try {
        console.log('✓ Connected to device.');
        console.log('\n⚠️  IMPORTANT: Make sure you are on the "Following" screen in Snapchat!');
        console.log('   (The screen that shows a list of people you follow with X buttons)\n');
        await driver.pause(500); // Minimal initial pause

        let count = 0;
        let consecutiveFailures = 0;

        while (count < MAX_UNFOLLOWS) {
            console.log(`\n━━━ Iteration ${count + 1}/${MAX_UNFOLLOWS} ━━━`);

            // 1. Find a row (default 4th to avoid notifications at top)
            console.log('🔍 Looking for follower rows...');
            const rowSelectors = [
                `//androidx.recyclerview.widget.RecyclerView/android.widget.FrameLayout[${TARGET_ROW_INDEX}]/android.view.View`,
                `(//androidx.recyclerview.widget.RecyclerView//android.view.View[@clickable="true"])[${TARGET_ROW_INDEX}]`,
                `(//android.widget.FrameLayout[@resource-id="com.snapchat.android:id/0_resource_name_obfuscated"]//android.view.View[@clickable="true"])[${TARGET_ROW_INDEX}]`,
            ];

            let firstRow = null;
            for (const selector of rowSelectors) {
                try {
                    firstRow = await driver.$(selector);
                    const exists = await firstRow.waitForExist({ timeout: 3000 });
                    if (exists) {
                        console.log(`✓ Found row using: ${selector}`);
                        break;
                    }
                } catch (e) {
                    console.log(`✗ Row selector failed: ${selector}`);
                }
            }

            if (!firstRow) {
                console.log('❌ No follower rows found. Make sure you are on the Following screen.');
                await dumpPageSource(driver, 'no_rows_dump.xml');
                break;
            }

            // 2. Try tapping on the right side where the X button is (based on screenshot)
            console.log('👆 Tapping on the X button area (right side of row)...');
            const location = await firstRow.getLocation();
            const size = await firstRow.getSize();

            // Calculate X button position (right side, around 950-1020px based on screenshot)
            const xButtonX = location.x + size.width - 60; // 60px from right edge
            const xButtonY = location.y + (size.height / 2); // Center vertically

            // Use W3C Actions API for tapping at coordinates
            await driver.performActions([{
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: Math.round(xButtonX), y: Math.round(xButtonY) },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerUp', button: 0 }
                ]
            }]);
            await driver.releaseActions();

            await driver.pause(200); // Bare minimum for popup

            // 3. Wait for confirmation popup and click "Yes"
            console.log('🔍 Looking for "Yes" button in confirmation popup...');

            // The Yes button is a View element with no text, located above the Cancel button
            let yesButton = await findElementFlexible(driver, [
                // Try finding by dialog structure - the clickable View above Cancel button
                '//android.widget.LinearLayout[@resource-id="com.snapchat.android:id/dialog_content"]//android.view.View[@clickable="true"]',
                // Try finding Cancel button's previous sibling
                '//android.widget.TextView[@resource-id="com.snapchat.android:id/cancel_button"]/preceding-sibling::android.view.View[@clickable="true"]',
                // Try by bounds (approximate from screenshot)
                '//android.view.View[@bounds="[171,1159][909,1316]"]',
            ], 4000);

            // If not found by structure, find Cancel button and click above it
            if (!yesButton) {
                console.log('Trying to find Yes button relative to Cancel...');
                try {
                    const cancelButton = await driver.$('//android.widget.TextView[@resource-id="com.snapchat.android:id/cancel_button"]');
                    const cancelExists = await cancelButton.waitForExist({ timeout: 3000 });

                    if (cancelExists) {
                        const cancelLoc = await cancelButton.getLocation();
                        const cancelSize = await cancelButton.getSize();

                        // Yes button is above Cancel, tap in that area
                        const yesX = cancelLoc.x + (cancelSize.width / 2);
                        const yesY = cancelLoc.y - 100; // 100px above Cancel button

                        console.log(`👆 Tapping Yes button at coordinates (${Math.round(yesX)}, ${Math.round(yesY)})...`);
                        await driver.performActions([{
                            type: 'pointer',
                            id: 'finger1',
                            parameters: { pointerType: 'touch' },
                            actions: [
                                { type: 'pointerMove', duration: 0, x: Math.round(yesX), y: Math.round(yesY) },
                                { type: 'pointerDown', button: 0 },
                                { type: 'pause', duration: 100 },
                                { type: 'pointerUp', button: 0 }
                            ]
                        }]);
                        await driver.releaseActions();

                        count++;
                        consecutiveFailures = 0;
                        console.log(`✅ Unfollowed successfully! (${count}/${MAX_UNFOLLOWS})`);
                        // No delay - continue immediately
                        continue;
                    }
                } catch (e) {
                    console.log('Could not find Cancel button either.');
                }
            }

            if (!yesButton) {
                console.log('❌ "Yes" confirmation button not found.');
                await dumpPageSource(driver, 'no_yes_button_dump.xml');

                // Try to go back to close any popup
                await driver.back();
                await driver.pause(200);

                consecutiveFailures++;
                if (consecutiveFailures >= 3) {
                    console.log('⚠️  Too many consecutive failures. Exiting.');
                    break;
                }
                continue;
            }

            console.log('👆 Clicking "Yes" to confirm...');
            await yesButton.click();

            count++;
            consecutiveFailures = 0;
            console.log(`✅ Unfollowed successfully! (${count}/${MAX_UNFOLLOWS})`);

            // No delay - maximum speed
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🏁 Finished! Unfollowed ${count}/${MAX_UNFOLLOWS} accounts.`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (err) {
        console.error('💥 Critical Error:', err.message);
        console.error('Stack:', err.stack);
        try {
            await dumpPageSource(driver, 'critical_error_dump.xml');
        } catch (e) {
            console.error('Could not dump page source after critical error');
        }
    } finally {
        await driver.deleteSession();
        console.log('👋 Session closed.');
    }
}

run();
