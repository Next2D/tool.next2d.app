import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { TextSaveObjectImpl } from "@/interface/TextSaveObjectImpl";
import { Instance } from "./Instance";

/**
 * @description テキスト管理クラス
 *              Text management class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Text extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<TextSaveObjectImpl>)
    {
        super(object);
    }
}