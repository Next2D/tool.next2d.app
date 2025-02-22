import { execute as screenTabGetTextElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetTextElementService";
import { execute as screenTabGetListElementService } from "@/screen/application/ScreenTab/service/ScreenTabGetListElementService";

/**
 * @description タブとタブ一覧の表示情報を更新
 *              Update the display information of the tab and tab list
 *
 * @param  {number} work_space_id
 * @param  {string} name
 * @return {Promise}
 * @method
 * @public
 */
export const execute = async (work_space_id: number, name: string): Promise<void> =>
{
    const textElement = screenTabGetTextElementService(work_space_id);
    if (!textElement) {
        return ;
    }

    const listElement = screenTabGetListElementService(work_space_id);
    if (!listElement) {
        return ;
    }

    listElement.textContent = textElement.textContent = name;
};