import type { ObjectImpl } from "@/interface/ObjectImpl";
import type { ShapeSaveObjectImpl } from "@/interface/ShapeSaveObjectImpl";
import { Instance } from "./Instance";

/**
 * @description ベクター管理クラス
 *              Vector management class
 *
 * @extends {Instance}
 * @class
 * @public
 */
export class Shape extends Instance
{
    /**
     * @param {object} object
     * @constructor
     * @public
     */
    constructor (object: ObjectImpl<ShapeSaveObjectImpl>)
    {
        super(object);
    }
}