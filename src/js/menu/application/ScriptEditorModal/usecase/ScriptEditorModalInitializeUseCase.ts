import type { ScriptEditorCompletionWordObjectImpl } from "@/interface/ScriptEditorCompletionWordObjectImpl";
import { $getAceEditor } from "../ScriptEditorModalUtil";

/**
 * @description スクリプトエディタの初期起動処理
 *              Initial startup process of the Script Editor
 *
 * @return {void}
 * @method
 * @public
 */
export const execute = (): void =>
{
    const editor = $getAceEditor();

    editor.setOptions({
        "enableBasicAutocompletion": true,
        "enableSnippets": true,
        "enableLiveAutocompletion": true
    });

    editor.session.setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/monokai");

    editor.setShowPrintMargin(false);
    editor.setKeyboardHandler("ace/keybinding/vscode");

    const words: ScriptEditorCompletionWordObjectImpl[] = [
        { "word": "next2d", "meta": "keyword" }
    ];

    const keys: string[] = Object.keys(window.next2d);
    for (let idx = 1; idx < keys.length; ++idx) {

        const name: string = keys[idx];

        if (name.indexOf("$") > -1) {
            continue;
        }

        if (!(name in window.next2d)) {
            continue;
        }

        words.push({
            "word": `next2d.${name}`,
            "meta": "keyword"
        });

        // @ts-ignore
        const topObject: any = window.next2d[name];

        const props = Object.keys(topObject);
        for (let idx = 0; idx < props.length; ++idx) {

            const className = props[idx];
            words.push(
                {
                    "word": className,
                    "meta": `next2d.${name}.${className}`
                }
            );

            const ClassObject = topObject[className];
            const staticMethods = Object.getOwnPropertyDescriptors(ClassObject);
            const staticNames   = Object.getOwnPropertyNames(ClassObject);
            for (let idx = 0; idx < staticNames.length; ++idx) {

                const name = staticNames[idx];
                if (name.indexOf("$") > -1) {
                    continue;
                }

                switch (name) {

                    case "length":
                    case "prototype":
                    case "toString":
                    case "namespace":
                    case "name":
                        continue;

                    default:
                        break;

                }

                const object = staticMethods[name];
                if ("value" in object) {

                    const args = object
                        .value
                        .toString()
                        .replace(/ |\n/g, "")
                        .split("{")[0]
                        .split("(")[1]
                        .replace(")", "");

                    words.push({
                        "word": `${className}.${name}`,
                        "value": `${className}.${name}();`,
                        "meta": `${className}.${name}(${args})`
                    });

                } else {

                    words.push({
                        "word": `${className}.${name}`,
                        "meta": `${className}.${name}`
                    });

                }

            }

            const publicMethods = Object.getOwnPropertyDescriptors(ClassObject.prototype);
            const publicNames   = Object.getOwnPropertyNames(ClassObject.prototype);
            for (let idx = 0; idx < publicNames.length; ++idx) {

                const name = publicNames[idx];

                if (name.indexOf("$") > -1) {
                    continue;
                }

                switch (name) {

                    case "constructor":
                    case "toString":
                    case "namespace":
                    case "name":
                        continue;

                    default:
                        break;

                }

                const object = publicMethods[name];
                if ("value" in object) {

                    const args = object
                        .value
                        .toString()
                        .replace(/ |\n/g, "")
                        .split("{")[0]
                        .split("(")[1]
                        .replace(")", "");

                    words.push({
                        "word": `${className}.${name}`,
                        "value": `${name}();`,
                        "meta": `${className}.${name}(${args})`
                    });

                } else {

                    words.push({
                        "word": name,
                        "meta": `${className}.${name}`
                    });

                }
            }
        }
    }

    ace
        .require("ace/ext/language_tools")
        .addCompleter({
            // eslint-disable-next-line no-unused-vars
            "getCompletions": (_editor: any, _session: any, _pos: any, _prefix: any, callback: Function) =>
            {
                callback(null, words.map((object) =>
                {
                    return {
                        "caption": object.word,
                        "value":   object.value || object.word,
                        "meta":    object.meta,
                        "score":   0
                    };
                }));
            }
        });
};