import { strokeColor } from "@/tool/domain/model/StrokeColor";
import { execute as userStrokeColorUpdateService } from "@/user/application/Tool/service/UserStrokeColorUpdateService";
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
    userStrokeColorUpdateService(element.value);
    strokeColor.value = element.value;
};