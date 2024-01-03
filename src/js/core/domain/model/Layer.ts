import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { execute as timelineLayerControllerGetHighlightColorService } from "@/timeline/application/TimelineLayerController/service/TimelineLayerControllerGetHighlightColorService";
import { Character } from "./Character";
import { EmptyCharacter } from "./EmptyCharacter";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import type { EmptyCharacterSaveObjectImpl } from "@/interface/EmptyCharacterSaveObjectImpl";
import { $getCurrentWorkSpace } from "@/core/application/CoreUtil";
import { $getTopIndex } from "@/timeline/application/TimelineUtil";

/**
 * @description タイムラインのレイヤー状態管理クラス
 *              Timeline layer state management class
 *
 * @class
 * @public
 */
export class Layer
{
    private _$id: number;
    private _$name: string;
    private _$color: string;
    private _$light: boolean;
    private _$disable: boolean;
    private _$lock: boolean;
    private _$mode: LayerModeImpl;
    private _$maskId: null | number;
    private _$guideId: null | number;
    private readonly _$characters: Character[];
    private readonly _$emptys: EmptyCharacter[];

    /**
     * @param {object} [object = null]
     * @constructor
     * @public
     */
    constructor (object: LayerSaveObjectImpl | null = null)
    {
        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$id = 0;

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$name = "";

        /**
         * @type {string}
         * @default ""
         * @private
         */
        this._$color = "";

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$light = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$disable = false;

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$lock = false;

        /**
         * @type {number}
         * @default 0
         * @private
         */
        this._$mode = 0;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$maskId = null;

        /**
         * @type {number}
         * @default null
         * @private
         */
        this._$guideId = null;

        /**
         * @type {array}
         * @private
         */
        this._$characters = [];

        /**
         * @type {array}
         * @private
         */
        this._$emptys = [];

        if (object) {
            this.load(object);
        } else {
            this._$color = timelineLayerControllerGetHighlightColorService();
        }
    }

    /**
     * @description Layerの固有ID
     *              Unique ID of Layer
     *
     * @member {number}
     * @public
     */
    get id (): number
    {
        return this._$id;
    }
    set id (id: number)
    {
        this._$id = id;
    }

    /**
     * @description Layerの表示名
     *              Layer display name
     *
     * @member {string}
     * @public
     */
    get name (): string
    {
        return this._$name;
    }
    set name (name: string)
    {
        this._$name = name;
    }

    /**
     * @description ハイライトのon/off設定
     *              Highlight on/off setting
     *
     * @default false
     * @member  {boolean}
     * @public
     */
    get light (): boolean
    {
        return this._$light;
    }
    set light (light: boolean)
    {
        this._$light = light;
    }

    /**
     * @description 表示/非表示の設定
     *              Show/Hide settings
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get disable (): boolean
    {
        return this._$disable;
    }
    set disable (disable: boolean)
    {
        this._$disable = disable;
    }

    /**
     * @description レイヤーロックのon/off設定
     *              Layer lock on/off setting
     *
     * @default false
     * @member {boolean}
     * @public
     */
    get lock (): boolean
    {
        return this._$lock;
    }
    set lock (lock: boolean)
    {
        this._$lock = lock;
    }

    /**
     * @description ハイライトカラーの値
     *              Highlight Color Value
     *
     * @member {string}
     * @public
     */
    get color (): string
    {
        return this._$color;
    }
    set color (color: string)
    {
        this._$color = `${color}`;
    }

    /**
     * @description レイヤーのモードの値
     *              Layer mode value
     *
     * @default 0
     * @member {number}
     * @public
     */
    get mode (): LayerModeImpl
    {
        return this._$mode;
    }
    set mode (mode: LayerModeImpl)
    {
        this._$mode = mode;
    }

    /**
     * @description マスクレイヤーのID
     *              Mask Layer ID
     *
     * @default null
     * @member {number|null}
     * @public
     */
    get maskId (): null | number
    {
        return this._$maskId;
    }
    set maskId (mask_id: null | number)
    {
        this._$maskId = mask_id;
    }

    /**
     * @description ガイドレイヤーのID
     *              Guide Layer ID
     *
     * @default null
     * @member {number|null}
     * @public
     */
    get guideId (): null | number
    {
        return this._$guideId;
    }
    set guideId (guide_id: null | number)
    {
        this._$guideId = guide_id;
    }

    /**
     * @description レイヤー内のDisplayObject配列
     *              DisplayObject array in layer
     *
     * @member {array}
     * @readonly
     * @public
     */
    get characters (): Character[]
    {
        return this._$characters;
    }

    /**
     * @description レイヤー内の空のキーフレーム配列
     *              Empty keyframe array in layer
     *
     * @member {array}
     * @readonly
     * @public
     */
    get emptyCharacters (): EmptyCharacter[]
    {
        return this._$emptys;
    }

    /**
     * @description 現在の表示index値を返却
     *              Return current display index value
     *
     * @return {number}
     * @method
     * @public
     */
    getDisplayIndex (): number
    {
        const scene = $getCurrentWorkSpace().scene;
        const index = scene.layers.indexOf(this);
        return index === -1 ? index : index - $getTopIndex();
    }

    /**
     * @description 保存データからLayerを復元
     *              Restore Layer from stored data
     *
     * @param  {object} object
     * @return {void}
     * @method
     * @public
     */
    load (object: LayerSaveObjectImpl): void
    {
        this._$name    = object.name;
        this._$color   = object.color;
        this._$lock    = object.lock;
        this._$disable = object.disable;
        this._$light   = object.light;
        this._$mode    = object.mode;
        this._$maskId  = object.maskId;
        this._$guideId = object.guideId;

        // 各、キャラクターの読み込み
        this.loadCharacter(object.characters);
        this.loadEmptyCharacter(object.characters);
    }

    /**
     * @description セーブデータからキャラクターオブジェクトを複製
     *              Duplicate character objects from saved data
     *
     * @param  {array} characters
     * @return {void}
     * @method
     * @public
     */
    loadCharacter (characters: CharacterSaveObjectImpl[]): void
    {
        if (!characters || !characters.length) {
            return ;
        }

        console.log("TODO", characters);
    }

    /**
     * @description セーブデータから空のキャラクターオブジェクトを複製
     *              Duplicate empty character objects from saved data
     *
     * @param  {array} empty_characters
     * @return {void}
     * @method
     * @public
     */
    loadEmptyCharacter (empty_characters: EmptyCharacterSaveObjectImpl[]): void
    {
        if (!empty_characters || !empty_characters.length) {
            return ;
        }

        console.log("TODO", empty_characters);
    }

    /**
     * @description ハイライトカラーをセットしたsvgのパスを返す
     *              Returns the path to the svg with highlight color set
     *
     * @return {string}
     * @method
     * @public
     */
    getHighlightURL (): string
    {
        const bigint: number = parseInt(`0x${this.color.slice(1)}`, 16);
        const red: number    = bigint >> 16 & 255;
        const green: number  = bigint >> 8 & 255;
        const blue: number   = bigint & 255;

        return `data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"><path fill="rgb(${red},${green},${blue})" d="M14 19h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm0 2h-4c-.276 0-.5.224-.5.5s.224.5.5.5h4c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm.25 2h-4.5l1.188.782c.154.138.38.218.615.218h.895c.234 0 .461-.08.615-.218l1.187-.782zm3.75-13.799c0 3.569-3.214 5.983-3.214 8.799h-1.989c-.003-1.858.87-3.389 1.721-4.867.761-1.325 1.482-2.577 1.482-3.932 0-2.592-2.075-3.772-4.003-3.772-1.925 0-3.997 1.18-3.997 3.772 0 1.355.721 2.607 1.482 3.932.851 1.478 1.725 3.009 1.72 4.867h-1.988c0-2.816-3.214-5.23-3.214-8.799 0-3.723 2.998-5.772 5.997-5.772 3.001 0 6.003 2.051 6.003 5.772zm4-.691v1.372h-2.538c.02-.223.038-.448.038-.681 0-.237-.017-.464-.035-.69h2.535zm-10.648-6.553v-1.957h1.371v1.964c-.242-.022-.484-.035-.726-.035-.215 0-.43.01-.645.028zm-3.743 1.294l-1.04-1.94 1.208-.648 1.037 1.933c-.418.181-.822.401-1.205.655zm10.586 1.735l1.942-1.394.799 1.115-2.054 1.473c-.191-.43-.423-.827-.687-1.194zm-3.01-2.389l1.038-1.934 1.208.648-1.041 1.941c-.382-.254-.786-.473-1.205-.655zm-10.068 3.583l-2.054-1.472.799-1.115 1.942 1.393c-.264.366-.495.763-.687 1.194zm13.707 6.223l2.354.954-.514 1.271-2.425-.982c.21-.397.408-.812.585-1.243zm-13.108 1.155l-2.356 1.06-.562-1.251 2.34-1.052c.173.433.371.845.578 1.243zm-1.178-3.676h-2.538v-1.372h2.535c-.018.226-.035.454-.035.691 0 .233.018.458.038.681z"/></svg>`;
    }

    /**
     * @description セーブオブジェクトに変換
     *              Convert to save object
     *
     * @return {object}
     * @method
     * @public
     */
    toObject (): LayerSaveObjectImpl
    {
        const characters = [];
        for (let idx = 0; idx < this._$characters.length; ++idx) {
            const character = this._$characters[idx];
            characters.push(character.toObject());
        }

        const emptyCharacters = [];
        for (let idx = 0; idx < this._$emptys.length; ++idx) {
            const emptyCharacter = this._$emptys[idx];
            emptyCharacters.push(emptyCharacter.toObject());
        }

        return {
            "name": this._$name,
            "color": this._$color,
            "lock": this._$lock,
            "disable": this._$disable,
            "light": this._$light,
            "mode": this._$mode,
            "maskId": this._$maskId,
            "guideId": this._$guideId,
            "characters": characters,
            "emptyCharacters": emptyCharacters
        };
    }
}