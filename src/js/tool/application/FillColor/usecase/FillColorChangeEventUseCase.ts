import { fillColor } from "@/tool/domain/model/FillColor";
import { execute as userFillColorUpdateService } from "@/user/application/Tool/service/UserFillColorUpdateService";
/**
 * @description 塗りの色を変更して、LocalStorageに保存
 *              Change the fill color and save it to LocalStorage
 *
 * @param  {Event} event
 * @return {void}
 * @method
 * @public
 */
export const execute = (event: Event): void =>
{
    // イベントの伝播を止める
    event.stopPropagation();
    event.preventDefault();

    const element = event.target as HTMLInputElement;
    if (!element) {
        return ;
    }

    // 塗りのカラーを更新
    userFillColorUpdateService(element.value);
    fillColor.value = element.value;
};