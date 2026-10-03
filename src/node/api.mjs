/**
 * Wrap operations for consumption in Node.
 *
 * @author d98762625 [d98762625@gmail.com]
 * @copyright Crown Copyright 2018
 * @license Apache-2.0
 */

/* eslint no-console: ["off"] */

import NodeDish from "./NodeDish.mjs";
import NodeRecipe from "./NodeRecipe.mjs";
import OperationConfig from "../core/config/OperationConfig.json" with { type: "json" };
import ParameterNameMap from "../core/zh-cn/ParameterNameMap.json" with { type: "json" };
import EnglishDescriptionMap from "../core/zh-cn/EnglishDescriptionMap.json" with { type: "json" };
import { sanitise, removeSubheadingsFromArray, sentenceToCamelCase } from "./apiUtils.mjs";
import ExcludedOperationError from "../core/errors/ExcludedOperationError.mjs";


/**
 * transformArgs
 *
 * Take the default args array and update with any user-defined
 * operation arguments. Allows user to define arguments in object style,
 * with accommodating name matching. Using named args in the API is more
 * clear to the user.
 *
 * Argument name matching is case and space insensitive
 * @private
 * @param {Object[]} originalArgs - the operation-s args list
 * @param {Object} newArgs - any inputted args
 */
function transformArgs(opArgsList, newArgs, opNameZh) {

    if (newArgs && Array.isArray(newArgs)) {
        return newArgs;
    }

    // 中文操作名对应的官方英文参数名（按顺序），用于兼容官方英文对象键
    const enArgNames = (opNameZh && ParameterNameMap[opNameZh] && ParameterNameMap[opNameZh].args) || null;

    // Filter out arg values that are list subheadings - they are surrounded in [].
    // See Strings op for example.
    const opArgs = Object.assign([], opArgsList).map((a) => {
        if (Array.isArray(a.value)) {
            a.value = removeSubheadingsFromArray(a.value);
        }
        return a;
    });

    // Reconcile object style arg info to fit operation args shape.
    if (newArgs) {
        Object.keys(newArgs).map((key) => {
            const index = opArgs.findIndex((arg, i) => {
                const zhMatch = arg.name.toLowerCase().replace(/ /g, "") ===
                    key.toLowerCase().replace(/ /g, "");
                if (zhMatch) return true;
                const enName = enArgNames && enArgNames[i];
                return !!enName && enName.toLowerCase().replace(/ /g, "") ===
                    key.toLowerCase().replace(/ /g, "");
            });

            if (index > -1) {
                const argument = opArgs[index];
                if (argument.type === "toggleString") {
                    if (typeof newArgs[key] === "string") {
                        argument.string = newArgs[key];
                    } else {
                        argument.string = newArgs[key].string;
                        argument.option = newArgs[key].option;
                    }
                } else if (argument.type === "editableOption") {
                    // takes key: "option", key: {name, val: "string"}, key: {name, val: [...]}
                    argument.value = typeof newArgs[key] === "string" ? newArgs[key]: newArgs[key].value;
                } else {
                    argument.value = newArgs[key];
                }
            }
        });
    }

    // Sanitise args
    return opArgs.map((arg) => {
        // 汉化版选项可能为 {name, value} 对象数组（value 保留英文内部值），
        // 取默认值时需解包为字符串值，否则会传入对象导致校验/运行错误。
        const unpackDefault = (def) => {
            if (typeof def === "object" && def !== null) {
                return (def.value !== undefined ? def.value : def.name);
            }
            return def;
        };

        if (arg.type === "option") {
            // pick default option if not already chosen
            return !Array.isArray(arg.value) ? arg.value : unpackDefault(arg.value[arg.defaultIndex ?? 0]);
        }

        if (arg.type === "argSelector") {
            return !Array.isArray(arg.value) ? arg.value : (unpackDefault(arg.value[arg.defaultIndex ?? 0]) || "");
        }

        if (arg.type === "editableOption") {
            return typeof arg.value === "string" ? arg.value : unpackDefault(arg.value[arg.defaultIndex ?? 0]);
        }

        if (arg.type === "toggleString") {
            // ensure string and option exist when user hasn't defined
            arg.string = arg.string || "";
            arg.option = arg.option || arg.toggleValues[0];
            return arg;
        }

        return arg.value;
    });
}


/**
 * Ensure an input is a SyncDish object.
 * @param input
 */
function ensureIsDish(input) {
    if (input === undefined || input === null) {
        return new NodeDish();
    }

    if (input instanceof NodeDish) {
        return input;
    } else {
        return new NodeDish(input);
    }
}


/**
 * prepareOp: transform args, make input the right type.
 * Also convert any Buffers to ArrayBuffers.
 * @param opInstance - instance of the operation
 * @param input - operation input
 * @param args - operation args
 */
function prepareOp(opInstance, input, args) {
    const dish = ensureIsDish(input);
    // Transform object-style args to original args array
    const transformedArgs = transformArgs(opInstance.args, args, opInstance.name);
    const transformedInput = dish.get(opInstance.inputType);
    return {transformedInput, transformedArgs};
}


/**
 * createArgInfo
 *
 * Create an object of options for each argument in the given operation
 *
 * Argument names are converted to camel case for consistency.
 *
 * @param {Operation} op - the operation to extract args from
 * @returns {{}} - arrays of options for args.
*/
function createArgInfo(op) {
    const result = {};
    const enArgNames = (op.name && ParameterNameMap[op.name] && ParameterNameMap[op.name].args) || [];
    op.args.forEach((a, i) => {
        let info;
        if (a.type === "option" || a.type === "editableOption") {
            info = {
                type: a.type,
                // Node API 兼容官方契约：options 暴露英文 value（去掉中文 name）
                options: removeSubheadingsFromArray(a.value).map((o) => typeof o === "string" ? o : o.value)
            };
        } else if (a.type === "toggleString") {
            info = {
                type: a.type,
                value: a.value,
                toggleValues: removeSubheadingsFromArray(a.toggleValues),
            };
        } else {
            info = {
                type: a.type,
                value: a.value,
            };
        }
        // Node API 兼容官方契约：暴露英文参数名键；无映射时回退中文键保证可访问
        const enName = enArgNames[i];
        if (enName) {
            result[sentenceToCamelCase(enName)] = info;
        } else {
            result[sentenceToCamelCase(a.name)] = info;
        }
    });

    return result;
}


/**
 * Wrap an operation to be consumed by node API.
 * Checks to see if run function is async or not.
 * new Operation().run() becomes operation()
 * Perform type conversion on input
 * @private
 * @param {Operation} Operation
 * @returns {Function} The operation's run function, wrapped in
 * some type conversion logic
 */
export function _wrap(OpClass) {

    // Check to see if class's run function is async.
    const opInstance = new OpClass();
    const isAsync = opInstance.run.constructor.name === "AsyncFunction";
    const isFlowControl = opInstance.flowControl;

    let wrapped;

    // If async, wrap must be async.
    if (isAsync) {
        /**
         * Async wrapped operation run function
         * @param {*} input
         * @param {Object | String[]} args - either in Object or normal args array
         * @returns {Promise<SyncDish>} operation's output, on a Dish.
         * @throws {OperationError} if the operation throws one.
         */
        wrapped = async (input, args=null) => {
            const {transformedInput, transformedArgs} = prepareOp(opInstance, input, args);

            opInstance.validateIngredients(transformedArgs);

            // SPECIAL CASE for Magic. Other flowControl operations will
            // not work because the opList is not passed in.
            if (isFlowControl) {
                opInstance.ingValues = transformedArgs;

                const state = {
                    progress: 0,
                    dish: ensureIsDish(transformedInput),
                    opList: [opInstance],
                };

                const updatedState = await opInstance.run(state);

                return new NodeDish({
                    value: updatedState.dish.value,
                    type: opInstance.outputType,
                });
            }

            const result = await opInstance.run(transformedInput, transformedArgs);

            return new NodeDish({
                value: result,
                type: opInstance.outputType,
            });
        };
    } else {
        /**
         * wrapped operation run function
         * @param {*} input
         * @param {Object | String[]} args - either in Object or normal args array
         * @returns {SyncDish} operation's output, on a Dish.
         * @throws {OperationError} if the operation throws one.
         */
        wrapped = (input, args=null) => {
            const {transformedInput, transformedArgs} = prepareOp(opInstance, input, args);
            opInstance.validateIngredients(transformedArgs);
            const result = opInstance.run(transformedInput, transformedArgs);
            return new NodeDish({
                value: result,
                type: opInstance.outputType,
            });
        };
    }

    // used in chef.help
    wrapped.opName = OpClass.name;
    wrapped.args = createArgInfo(opInstance);
    // Used in NodeRecipe to check for flowControl ops
    wrapped.flowControl = isFlowControl;

    return wrapped;
}


/**
 * help: Give information about operations matching the given search term,
 * or inputted operation.
 *
 * @param {String || wrapped operation} input - the name of the operation to get help for.
 * Case and whitespace are ignored in search.
 * @returns {Object[]} Config of matching operations.
 */
export function help(input) {
    let searchTerm = false;
    if (typeof input === "string") {
        searchTerm = input;
    } else if (typeof input === "function") {
        searchTerm = input.opName;
    }

    if (!searchTerm) {
        return null;
    }

    let exactMatchExists = false;

    // Look for matches in operation name and description, listing name
    // matches first.
    const matches = Object.keys(OperationConfig)
        // hydrate operation: swap op name for op config object (with name)
        .map((m) => {
            const hydrated = OperationConfig[m];
            hydrated.name = m;

            // 中文操作名对应的官方英文名，支持官方英文搜索词
            const enName = ParameterNameMap[m] && ParameterNameMap[m].enName || null;
            // 官方英文描述，支持英文描述搜索（汉化后描述为中文）
            const enDesc = EnglishDescriptionMap[m] && EnglishDescriptionMap[m].enDescription || null;
            const nameMatches = (name) => !!name && sanitise(name) === sanitise(searchTerm);
            const nameContains = (name) => !!name && sanitise(name).includes(sanitise(searchTerm));

            // flag up an exact name match. Only first exact match counts.
            if (!exactMatchExists) {
                exactMatchExists = nameMatches(hydrated.name) || nameMatches(enName);
            }
            // Return hydrated along with what type of match it was
            return {
                hydrated,
                nameExactMatch: nameMatches(hydrated.name) || nameMatches(enName),
                nameMatch: nameContains(hydrated.name) || nameContains(enName),
                descMatch: sanitise(hydrated.description).includes(sanitise(searchTerm)) ||
                    (!!enDesc && sanitise(enDesc).includes(sanitise(searchTerm)))
            };
        })
        // Filter out non-matches. If exact match exists, filter out all others.
        .filter((result) => {
            if (exactMatchExists) {
                return !!result.nameExactMatch;
            }
            return result.nameMatch || result.descMatch;
        })
        // sort results with name match first
        .sort((a, b) => {
            const aInt = a.nameMatch ? 1 : 0;
            const bInt = b.nameMatch ? 1  : 0;
            return bInt - aInt;
        })
        // extract just the hydrated config
        .map(result => result.hydrated);

    if (matches && matches.length) {
        // console.log(`${matches.length} result${matches.length > 1 ? "s" : ""} found.`);
        return matches;
    }

    // console.log("No results found.");
    return null;
}


/**
 * bake
 *
 * @param {*} input - some input for a recipe.
 * @param {String | Function | String[] | Function[] | [String | Function]} recipeConfig -
 * An operation, operation name, or an array of either.
 * @returns {NodeDish} of the result
 * @throws {TypeError} if invalid recipe given.
 */
export async function bake(input, recipeConfig) {
    const recipe = new NodeRecipe(recipeConfig);
    const dish = ensureIsDish(input);
    return await recipe.execute(dish);
}


/**
 * explainExcludedFunction
 *
 * Explain that the given operation is not included in the Node.js version.
 * @param {String} name - name of operation
 */
export function _explainExcludedFunction(name, displayName=null) {
    /**
     * Throw new error type with useful message.
    */
    const shown = displayName || name;
    const func = () => {
        throw new ExcludedOperationError(`抱歉，${shown} 操作在 Node.js 版的 CyberChef 中不可用。`);
    };
    // Add opName prop so NodeRecipe can handle it, just like wrap does.
    func.opName = name;
    return func;
}
