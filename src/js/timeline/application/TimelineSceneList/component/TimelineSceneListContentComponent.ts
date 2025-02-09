import { IInstance } from "@/interface/IInstance";

/**
 * @description タイムラインのシーン名一覧のElementをstringで返却
 *              Element of the list of scene names in the timeline is returned as a string
 *
 * @params {Instance} instance
 * @return {string}
 * @method
 * @public
 */
export const execute = (instance: IInstance<any>): string =>
{
    return `
<div id="scene-library-id-${instance.id}" data-library-id="${instance.id}">${instance.name}</div>
`;
};