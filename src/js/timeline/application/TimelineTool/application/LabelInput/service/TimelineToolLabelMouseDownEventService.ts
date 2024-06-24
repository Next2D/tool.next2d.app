import { $allHideMenu } from "@/menu/application/MenuUtil";

export const execute = (event: PointerEvent): void =>
{
    // 他のイベントを中止
    event.stopPropagation();

    // メニューを非表示
    $allHideMenu();
};