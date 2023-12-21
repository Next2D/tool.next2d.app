import type { ShortcutOptionObjectImpl } from "@/interface/ShortcutOptionObjectImpl";
import type { ShortcutViewObjectImpl } from "@/interface/ShortcutViewObjectImpl";
import { $generateShortcutKey } from "@/shortcut/ShortcutUtil";
import {
    $getSelectElement,
    $getTempMapping
} from "../ShortcutSettingMenuUtil";

/**
 * @description 選択されたElementのショートカットの内部情報を更新
 *              Update internal information of shortcut for selected Element
 *
 * @params {KeyboardEvent} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: KeyboardEvent): boolean =>
{
    switch (event.key) {

        case "Shift":
        case "Control":
        case "Alt":
        case "Meta":
            return true;

        default:
            break;

    }

    const element: HTMLElement | null = $getSelectElement();
    if (!element) {
        return true;
    }

    const elements: HTMLCollection = element.getElementsByClassName("command");
    if (!elements.length) {
        return true;
    }

    // 親のイベントを中止
    event.stopPropagation();
    event.stopImmediatePropagation();
    event.preventDefault();

    // TODO
    const texts: string[] = [];
    const options: ShortcutOptionObjectImpl = {
        "shift": false,
        "alt": false,
        "ctrl": false
    };

    // ShiftキーがOn
    if (event.shiftKey) {
        options.shift = true;
        texts.push("Shift");
    }

    // AltキーがOn
    if (event.altKey) {
        options.alt = true;
        texts.push("Alt");
    }

    // Ctrlキー(Windows)かCommandキー(Mac)がOn
    if (event.ctrlKey || event.metaKey) {
        options.ctrl = true;
        texts.push("Ctrl");
    }

    switch (true) {

        // スペースキー
        case event.key === " ":
            texts.push(event.code);
            break;

        case event.key.length === 1:
            texts.push(event.key.toUpperCase());
            break;

        default:
            texts.push(event.key);
            break;

    }

    const customKey: string   = $generateShortcutKey(event.key, options);
    const commandText: string = texts.join(" + ");

    const commandElement: HTMLElement = elements[0] as HTMLElement;
    if (!commandElement) {
        return true;
    }

    const tempMapping: Map<string, ShortcutViewObjectImpl> = $getTempMapping();
    const defaultKey: string = commandElement.dataset.defaultKey as NonNullable<string>;

    // 一度削除して再登録
    tempMapping.delete(defaultKey);

    if (defaultKey !== customKey) {
        tempMapping.set(defaultKey, {
            "defaultKey": defaultKey,
            "customKey": customKey,
            "text": commandText
        });
    }

    // 表示を更新
    commandElement.textContent = `${commandText}`;

    return false;
};