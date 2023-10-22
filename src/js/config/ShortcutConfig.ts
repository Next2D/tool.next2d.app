import { ShortcutObjectImpl } from "../interface/ShortcutObjectImpl";

/**
 * @description ショートカットメニューの保存ElementのID
 *              ID of the Element where the shortcut menu is saved
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_SAVE_ID: string = "shortcut-setting-save";

/**
 * @description ショートカットメニューのリセットElementのID
 *              ID of the reset Element in the shortcut menu
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_RESET_ID: string = "shortcut-setting-reset";

/**
 * @description ショートカットメニューの閉じるElementのID
 *              ID of the Element to close in the shortcut menu
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_CLOSE_ID: string = "shortcut-setting-close";

/**
 * @description スクリーンエリアのショートカット一覧ElementのID
 *              ID of the shortcut list Element in the screen area
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SCREEN_LIST_ID: string = "shortcut-list-screen";

/**
 * @description タイムラインのショートカット一覧ElementのID
 *              ID of the shortcut list Element on the timeline
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_TIMELINE_LIST_ID: string = "shortcut-list-timeline";

/**
 * @description ライブラリエリアのショートカット一覧ElementのID
 *              ID of the shortcut list Element in the library area
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_LIBRARY_LIST_ID: string = "shortcut-list-library";

/**
 * @description スクリーンショートカット表示ボタンのElementのID
 *              ID of the Element of the screen shortcut display button
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_SCREEN_ID: string = "shortcut-setting-screen";

/**
 * @description タイムラインショートカット表示ボタンのElementのID
 *              ID of the Element of the timeline shortcut display button
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_TIMELINE_ID: string = "shortcut-setting-timeline";

/**
 * @description ライブラリショートカット表示ボタンのElementのID
 *              ID of the Element of the library shortcut display button
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_LIBRARY_ID: string = "shortcut-setting-library";

/**
 * @description ショートカットリストの親ElementのID
 *              ID of the parent Element of the shortcut list
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_LIST_ID: string = "shortcut-setting-list";

/**
 * @description ショートカットリストのElementにセットされるクラス名
 *              Class name set to Element in the shortcut list
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SETTING_LIST_CLASS_NAME: string = "shortcut-item";

/**
 * @description スクリーンエリアのデフォルトのショートカットリスト
 *              Default shortcut list for screen area
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_SCREEN_LIST: ShortcutObjectImpl[] = [
    {
        "key": "v",
        "text": "V",
        "css": "tools-arrow",
        "description": "{{選択ツール}}"
    },
    {
        "key": "q",
        "text": "Q",
        "css": "tools-arrow-transform",
        "description": "{{自由変形ツール}}"
    },
    {
        "key": "a",
        "text": "A",
        "css": "tools-transform",
        "description": "{{Shape変形ツール}}"
    },
    {
        "key": "p",
        "text": "P",
        "css": "tools-pen",
        "description": "{{ペンツール}}"
    },
    {
        "key": "k",
        "text": "K",
        "css": "tools-bucket",
        "description": "{{バケツツール}}"
    },
    {
        "key": "r",
        "text": "R",
        "css": "tools-rectangle",
        "description": "{{矩形ツール}}"
    },
    {
        "key": "o",
        "text": "O",
        "css": "tools-circle",
        "description": "{{楕円ツール}}"
    },
    {
        "key": "rShift",
        "text": "Shift + R",
        "css": "tools-round-rect",
        "description": "{{角丸矩形ツール}}"
    },
    {
        "key": "t",
        "text": "T",
        "css": "tools-text",
        "description": "{{テキストツール}}"
    },
    {
        "key": "z",
        "text": "Z",
        "css": "tools-zoom",
        "description": "{{ズームツール}}"
    },
    {
        "key": "rCtrl",
        "text": "Ctrl + R",
        "css": "tools-load",
        "description": "{{プロジェクトデータの読込}}"
    },
    {
        "key": "sShiftCtrl",
        "text": "Ctrl + Shift + S",
        "css": "tools-save",
        "description": "{{プロジェクトデータを保存}}"
    },
    {
        "key": "EnterShiftCtrl",
        "text": "Ctrl + Shift + Enter",
        "css": "tools-export",
        "description": "{{書き出し}}"
    },
    {
        "key": "s",
        "text": "S",
        "css": "tools-setting",
        "description": "{{設定}}"
    },
    {
        "key": "ArrowUpShiftCtrl",
        "text": "Ctrl + Shift + ArrowUp",
        "css": "screen-front",
        "description": "{{最前面}}"
    },
    {
        "key": "ArrowUpCtrl",
        "text": "Ctrl + ArrowUp",
        "css": "screen-front-one",
        "description": "{{ひとつ前面へ}}"
    },
    {
        "key": "ArrowDownCtrl",
        "text": "Ctrl + ArrowDown",
        "css": "screen-menu-bottom",
        "description": "{{ひとつ背面へ}}"
    },
    {
        "key": "ArrowDownShiftCtrl",
        "text": "Ctrl + Shift + ArrowDown",
        "css": "screen-back",
        "description": "{{最背面}}"
    },
    {
        "key": "1",
        "text": "1",
        "css": "screen-position-left",
        "description": "{{左揃え}}"
    },
    {
        "key": "2",
        "text": "2",
        "css": "screen-position-center",
        "description": "{{中央揃え(水平方向)}}"
    },
    {
        "key": "3",
        "text": "3",
        "css": "screen-position-right",
        "description": "{{右揃え}}"
    },
    {
        "key": "4",
        "text": "4",
        "css": "screen-position-top",
        "description": "{{上揃え}}"
    },
    {
        "key": "5",
        "text": "5",
        "css": "screen-position-middle",
        "description": "{{中央揃え(垂直方向)}}"
    },
    {
        "key": "6",
        "text": "6",
        "css": "screen-position-bottom",
        "description": "{{下揃え}}"
    },
    {
        "key": "!Shift",
        "text": "Shift + 1",
        "css": "stage-position-left",
        "description": "{{ステージ左揃え}}"
    },
    {
        "key": "\"Shift",
        "text": "Shift + 2",
        "css": "stage-position-center",
        "description": "{{ステージ中央揃え(水平方向)}}"
    },
    {
        "key": "#Shift",
        "text": "Shift + 3",
        "css": "stage-position-right",
        "description": "{{ステージ右揃え}}"
    },
    {
        "key": "$Shift",
        "text": "Shift + 4",
        "css": "stage-position-top",
        "description": "{{ステージ上揃え}}"
    },
    {
        "key": "%Shift",
        "text": "Shift + 5",
        "css": "stage-position-middle",
        "description": "{{ステージ中央揃え(垂直方向)}}"
    },
    {
        "key": "&Shift",
        "text": "Shift + 6",
        "css": "stage-position-bottom",
        "description": "{{ステージ下揃え}}"
    },
    {
        "key": "dCtrl",
        "text": "Ctrl + D",
        "css": "screen-distribute-to-layers",
        "description": "{{レイヤーに配分}}"
    },
    {
        "key": "kCtrl",
        "text": "Ctrl + K",
        "css": "screen-distribute-to-keyframes",
        "description": "{{キーフレームに配分}}"
    },
    {
        "key": "iCtrl",
        "text": "Ctrl + I",
        "css": "screen-integrating-paths",
        "description": "{{パスの結合}}"
    },
    {
        "key": "pCtrl",
        "text": "Ctrl + P",
        "css": "screen-add-tween-curve-pointer",
        "description": "{{カーブポインターの追加}}"
    },
    {
        "key": "pShiftCtrl",
        "text": "Ctrl + Shift + P",
        "css": "screen-delete-tween-curve-pointer",
        "description": "{{カーブポインターの削除}}"
    },
    {
        "key": "mShift",
        "text": "Shift + M",
        "css": "screen-change-movie-clip",
        "description": "{{MovieClipに変換}}"
    },
    {
        "key": "rShiftCtrl",
        "text": "Ctrl + Shift + R",
        "css": "screen-ruler",
        "description": "{{定規}}"
    },
    {
        "key": "e",
        "text": "E",
        "css": "screen-change-scene",
        "description": "{{MovieClipを編集}}"
    },
    {
        "key": "eShift",
        "text": "Shift + E",
        "css": "screen-move-scene",
        "description": "{{親の階層へ移動}}"
    }
];

/**
 * @description タイムラインエリアのデフォルトのショートカットリスト
 *              Default shortcut list for the timeline area
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_TIMELINE_LIST: ShortcutObjectImpl[] = [
    {
        "key": "nShift",
        "text": "Shift + N",
        "css": "timeline-layer-normal",
        "description": "{{通常レイヤー}}"
    },
    {
        "key": "mShift",
        "text": "Shift + M",
        "css": "timeline-layer-mask",
        "description": "{{マスクレイヤー}}"
    },
    {
        "key": "gShift",
        "text": "Shift + G",
        "css": "timeline-layer-guide",
        "description": "{{ガイドレイヤー}}"
    },
    {
        "key": ";Ctrl",
        "text": "Ctrl + +",
        "css": "timeline-layer-add",
        "description": "{{レイヤーを追加}}"
    },
    {
        "key": "BackspaceCtrl",
        "text": "Ctrl + Backspace",
        "css": "timeline-layer-trash",
        "description": "{{レイヤーを削除}}"
    },
    {
        "key": "hShift",
        "text": "Shift + H",
        "css": "timeline-layer-light-all",
        "description": "{{全てのレイヤーをハイライト}}"
    },
    {
        "key": "dShift",
        "text": "Shift + D",
        "css": "timeline-layer-disable-all",
        "description": "{{全てのレイヤーを非表示}}"
    },
    {
        "key": "lShift",
        "text": "Shift + L",
        "css": "timeline-layer-lock-all",
        "description": "{{全てのレイヤーをロック}}"
    },
    {
        "key": "m",
        "text": "M",
        "css": "context-menu-tween-add",
        "description": "{{モーショントゥイーンの追加}}"
    },
    {
        "key": "mCtrl",
        "text": "Ctrl + M",
        "css": "context-menu-tween-delete",
        "description": "{{モーショントゥイーンの削除}}"
    },
    {
        "key": "s",
        "text": "S",
        "css": "timeline-script-add",
        "description": "{{スクリプトを追加}}"
    },
    {
        "key": "k",
        "text": "K",
        "css": "timeline-key-add",
        "description": "{{キーフレームを追加}}"
    },
    {
        "key": "kCtrl",
        "text": "Ctrl + K",
        "css": "timeline-key-delete",
        "description": "{{キーフレームを削除}}"
    },
    {
        "key": "e",
        "text": "E",
        "css": "timeline-empty-add",
        "description": "{{空のキーフレームを追加}}"
    },
    {
        "key": "F6",
        "text": "F6",
        "css": "context-menu-key-frame-change",
        "description": "{{キーフレームに変換}}"
    },
    {
        "key": "f",
        "text": "F",
        "css": "timeline-frame-add",
        "description": "{{フレームを追加}}"
    },
    {
        "key": "fCtrl",
        "text": "Ctrl + F",
        "css": "timeline-frame-delete",
        "description": "{{フレームを削除}}"
    },
    {
        "key": "oCtrl",
        "text": "Ctrl + O",
        "css": "timeline-onion-skin",
        "description": "{{オニオンスキン}}"
    },
    {
        "key": "p",
        "text": "P",
        "css": "timeline-preview",
        "description": "{{プレビューのON/OFF}}"
    },
    {
        "key": "pCtrl",
        "text": "Ctrl + P",
        "css": "timeline-repeat",
        "description": "{{ループ設定}}"
    },
    {
        "key": "l",
        "text": "L",
        "css": "label-name",
        "description": "{{フレームラベル}}"
    },
    {
        "key": "z",
        "text": "Z",
        "css": "timeline-scale",
        "description": "{{タイムライン幅の拡大・縮小}}"
    },
    {
        "key": "lCtrl",
        "text": "Ctrl + L",
        "css": "context-menu-layer-clone",
        "description": "{{レイヤーを複製}}"
    },
    {
        "key": "ArrowLeftShiftCtrl",
        "text": "Ctrl + Shift + ArrowLeft",
        "css": "context-menu-first-frame",
        "description": "{{最初のフレームに移動}}"
    },
    {
        "key": "ArrowRightShiftCtrl",
        "text": "Ctrl + Shift + ArrowRight",
        "css": "context-menu-last-frame",
        "description": "{{最後のフレームに移動}}"
    },
    {
        "key": "cCtrl",
        "text": "Ctrl + C",
        "css": "context-menu-frame-copy",
        "description": "{{フレームをコピー}}"
    },
    {
        "key": "vCtrl",
        "text": "Ctrl + V",
        "css": "context-menu-frame-paste",
        "description": "{{フレームをペースト}}"
    },
    {
        "key": "ArrowLeftAlt",
        "text": "Alt + ArrowLeft",
        "css": "context-menu-prev-key-frame",
        "description": "{{前のキーフレームに移動}}"
    },
    {
        "key": "ArrowRightAlt",
        "text": "Alt + ArrowRight",
        "css": "context-menu-next-key-frame",
        "description": "{{次のキーフレームに移動}}"
    },
    {
        "key": "kShiftCtrl",
        "text": "Ctrl + Shift + K",
        "css": "screen-align-coordinates-prev-keyframe",
        "description": "{{前のキーフレームと座標を合わせる}}"
    },
    {
        "key": "mShiftCtrl",
        "text": "Ctrl + Shift + M",
        "css": "screen-align-matrix-prev-keyframe",
        "description": "{{前のキーフレームと変形を合わせる}}"
    }
];

/**
 * @description ライブラリエリアのデフォルトのショートカットリスト
 *              Default shortcut list in the library area
 *
 * @type {string}
 * @constant
 */
export const $SHORTCUT_LIBRARY_LIST: ShortcutObjectImpl[] = [
    {
        "key": "mCtrl",
        "text": "Ctrl + M",
        "css": "library-menu-container-add",
        "description": "{{新規MovieClip}}"
    },
    {
        "key": "fCtrl",
        "text": "Ctrl + F",
        "css": "library-menu-folder-add",
        "description": "{{新規フォルダー}}"
    },
    {
        "key": "rCtrl",
        "text": "Ctrl + R",
        "css": "library-menu-file",
        "description": "{{読み込み}}"
    },
    {
        "key": "sShiftCtrl",
        "text": "Ctrl + Shift + S",
        "css": "library-menu-export",
        "description": "{{書き出し}}"
    },
    {
        "key": "Backspace",
        "text": "Backspace",
        "css": "library-menu-delete",
        "description": "{{削除}}"
    },
    {
        "key": "cCtrl",
        "text": "Ctrl + C",
        "css": "library-menu-copy",
        "description": "{{コピー}}"
    },
    {
        "key": "vCtrl",
        "text": "Ctrl + V",
        "css": "library-menu-paste",
        "description": "{{ペースト}}"
    },
    {
        "key": "e",
        "text": "E",
        "css": "library-menu-change-scene",
        "description": "{{MovieClipを編集}}"
    }
];