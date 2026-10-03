/**
 * Show on map tests
 *
 * @author Leon Zandman [leon@wirwar.com]
 *
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "Show on map: valid coordinate pair",
        input: "51.5007, -0.1246",
        // The presented output is the Leaflet map HTML; just check the coordinates made it through.
        expectedMatch: /51\.5007,-0\.1246/,
        recipeConfig: [
            {
                op: "Show on map",
                args: [13, "Auto", "Auto"]
            },
        ],
    },
    {
        // Regression test: a comma-separated input with the delimiter set to "\n" used to be
        // mis-detected as a single Degrees Decimal Minutes value (1° 24' = 1.4°), producing a single
        // coordinate. That single value was then passed to Leaflet's setView([1.4], ...), throwing
        // an uncaught "Cannot read properties of null (reading 'lat')" TypeError in the browser.
        name: "Show on map: single value is rejected with a helpful error",
        input: "1, 24",
        expectedOutput: "无法在地图上显示坐标 '1.4'。预期为经纬度对——请检查输入格式和分隔符是否正确。",
        recipeConfig: [
            {
                op: "Show on map",
                args: [13, "Auto", "\\n"]
            },
        ],
    },
    {
        name: "Show on map: empty input format is rejected",
        input: "1, 24",
        expectedOutput: "输入格式 不能为空。",
        recipeConfig: [
            {
                op: "Show on map",
                args: [13, "", "Auto"]
            },
        ],
    },
    {
        name: "Show on map: empty input delimiter is rejected",
        input: "1, 24",
        expectedOutput: "输入分隔符 不能为空。",
        recipeConfig: [
            {
                op: "Show on map",
                args: [13, "Auto", ""]
            },
        ],
    },
]);
