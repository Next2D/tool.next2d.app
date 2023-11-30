import type { LayerSaveObjectImpl } from "@/interface/LayerSaveObjectImpl";
import type { LayerModeImpl } from "@/interface/LayerModeImpl";
import { execute as timelineLayerGetHighlightColorService } from "@/timeline/application/TimelineLayer/service/TimelineLayerGetHighlightColorService";
import { Character } from "./Character";
import { EmptyCharacter } from "./EmptyCharacter";
import type { CharacterSaveObjectImpl } from "@/interface/CharacterSaveObjectImpl";
import type { EmptyCharacterSaveObjectImpl } from "@/interface/EmptyCharacterSaveObjectImpl";

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
    private _$display: "" | "none";
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
         * @type {string}
         * @default ""
         * @private
         */
        this._$display = "";

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
            this._$color = timelineLayerGetHighlightColorService();
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
     * @description 擬似スクロールでの表示領域に対してのレイヤー表示・非表示の状態管理
     *              Management of the state of display and non-display
     *              of layers for the displayed area in pseudo-scrolling
     *
     * @member {string}
     * @method
     * @public
     */
    get display (): "" | "none"
    {
        return this._$display;
    }
    set display (state: "" | "none")
    {
        this._$display = state;
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