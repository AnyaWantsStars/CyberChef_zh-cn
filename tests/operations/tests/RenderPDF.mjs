/**
 * RenderPDF tests.
 *
 * @copyright Crown Copyright 2026
 * @license Apache-2.0
 */
import TestRegister from "../../lib/TestRegister.mjs";


const oversizedPdfLikeInput = "%PDF-1.0\n" + "A".repeat(5000);


TestRegister.addTests([
    {
        name: "RenderPDF",
        input: "Not a PDF",
        expectedOutput: "输入似乎不是 PDF 文件。",
        recipeConfig: [
            {
                op: "Render PDF",
                args: ["Raw"]
            },
        ],
    },
    {
        name: "RenderPDF",
        input: "",
        expectedMatch: /^<iframe src="data:application\/pdf;base64,JVBERi0xLjAKCjEgMCBvYmogPDwg/,
        recipeConfig: [
            {
                "op": "Generate QR Code",
                "args": ["PDF", 1, 1, "Low"]
            },
            {
                "op": "Render PDF",
                "args": ["Raw"]
            }
        ],
    },
    {
        name: "RenderPDF followed by Generate QR Code error returns plain text",
        input: oversizedPdfLikeInput,
        expectedOutput: "生成 QR 码时出错。 (Error: Too much data)",
        recipeConfig: [
            {
                "op": "Render PDF",
                "args": ["Raw"]
            },
            {
                "op": "Generate QR Code",
                "args": ["PNG", 1, 0, "High"]
            }
        ],
    },
]);
