/* eslint camelcase: ["off"] */

const path = require("node:path");

const isWindows = process.platform === "win32";
const chromedriverPath = isWindows ?
    path.resolve(__dirname, "node_modules/chromedriver/lib/chromedriver/chromedriver.exe") :
    path.resolve(__dirname, "node_modules/.bin/chromedriver");

module.exports = {
    src_folders: ["tests/browser"],
    exclude: ["tests/browser/browserUtils.js"],
    output_folder: "tests/browser/output",

    test_settings: {
        default: {
            launch_url: "http://localhost:8080",
            webdriver: {
                start_process: true,
                server_path: chromedriverPath,
                port: 9515,
                log_path: "tests/browser/output",
            },
            desiredCapabilities: {
                browserName: "chrome",
                chromeOptions: {
                    args: ["--no-sandbox"],
                },
            },
            enable_fail_fast: true,
        },

        dev: {
            launch_url: "http://localhost:8080",
        },

        prod: {
            launch_url: "http://localhost:8000/index.html",
        },
    },
};
