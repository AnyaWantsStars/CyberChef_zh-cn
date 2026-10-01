/**
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Recipe from "../Recipe.mjs";
import Dish from "../Dish.mjs";

/**
 * Fork operation
 */
class Fork extends Operation {

    /**
     * Fork constructor
     */
    constructor() {
        super();

        this.name = "分支";
        this.flowControl = true;
        this.module = "Default";
        this.description = "根据指定的分隔符将输入数据拆分，并在每个分支上分别运行所有后续操作。<br><br>例如，要解码多个 Base64 字符串，将它们全部输入，每行一个，然后在流程中添加「分支」和「解码 Base64」操作。每个字符串将被单独解码。";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "分割分隔符",
                "type": "binaryShortString",
                "value": "\\n"
            },
            {
                "name": "合并分隔符",
                "type": "binaryShortString",
                "value": "\\n"
            },
            {
                "name": "忽略错误",
                "type": "boolean",
                "value": false
            }
        ];
    }

    /**
     * @param {Object} state - The current state of the recipe.
     * @param {number} state.progress - The current position in the recipe.
     * @param {Dish} state.dish - The Dish being operated on.
     * @param {Operation[]} state.opList - The list of operations in the recipe.
     * @returns {Object} The updated state of the recipe.
     */
    async run(state) {
        const opList     = state.opList,
            inputType    = opList[state.progress].inputType,
            outputType   = opList[state.progress].outputType,
            input        = await state.dish.get(inputType),
            ings         = opList[state.progress].ingValues,
            [splitDelim, mergeDelim, ignoreErrors] = ings,
            subOpList    = [];
        let inputs       = [],
            i;

        if (input)
            inputs = input.split(splitDelim);

        // Set to 1 as if we are here, then there is one, the current one.
        let numOp = 1;
        // Create subOpList for each tranche to operate on
        // all remaining operations unless we encounter a Merge
        for (i = state.progress + 1; i < opList.length; i++) {
            if (opList[i].name === "Merge" && !opList[i].disabled) {
                numOp--;
                if (numOp === 0 || opList[i].ingValues[0])
                    break;
                else
                    // Not this Fork's Merge.
                    subOpList.push(opList[i]);
            } else {
                if (opList[i].name === "Fork" || opList[i].name === "Subsection")
                    numOp++;
                subOpList.push(opList[i]);
            }
        }

        const recipe = new Recipe();
        const outputs = [];
        let progress = 0;

        state.forkOffset += state.progress + 1;

        recipe.addOperations(subOpList);

        // Take a deep(ish) copy of the ingredient values
        const ingValues = subOpList.map(op => JSON.parse(JSON.stringify(op.ingValues)));

        // Run recipe over each tranche
        for (i = 0; i < inputs.length; i++) {
            // Baseline ing values for each tranche so that registers are reset
            recipe.opList.forEach((op, i) => {
                op.ingValues = JSON.parse(JSON.stringify(ingValues[i]));
            });

            const dish = new Dish();
            dish.set(inputs[i], inputType);

            try {
                progress = await recipe.execute(dish, 0, state);
            } catch (err) {
                if (!ignoreErrors) {
                    throw err;
                }
                progress = err.progress + 1;
            }
            outputs.push(await dish.get(outputType));
        }

        state.dish.set(outputs.join(mergeDelim), outputType);
        state.progress += progress;
        return state;
    }

}

export default Fork;
