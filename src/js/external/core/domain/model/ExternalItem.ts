import { ExternalItemImpl } from "@/interface/ExternalItemImpl";

/**
 * @class
 */
export class ExternalItem
{
    private readonly _$instance: ExternalItemImpl<any>;

    /**
     * @param {ExternalItem} instance
     * @constructor
     * @public
     */
    constructor (instance: ExternalItemImpl<any>)
    {
        /**
         * @type {ExternalItem}
         * @private
         */
        this._$instance = instance;
    }

    /**
     * @description アイテムの識別ID
     *              Item Identification ID
     *
     * @return {number}
     * @readonly
     * @public
     */
    get id (): number
    {
        return this._$instance.id;
    }
}