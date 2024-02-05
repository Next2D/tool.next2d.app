import type { Folder } from "@/core/domain/model/Folder";

/**
 * @description フォルダの開閉状態のstyleを更新
 *              Update folder open/close state style
 *
 * @param  {Folder} folder
 * @return {void}
 * @method
 * @public
 */
export const execute = (folder: Folder): void =>
{
    const element: HTMLElement | null = document
        .getElementById(`library-child-id-${folder.id}`);

    if (!element) {
        return ;
    }

    const icons = element.getElementsByTagName("i");
    if (!icons.length) {
        return ;
    }

    const arrowElement  = icons[0] as NonNullable<HTMLElement>;
    const folderElement = icons[1] as NonNullable<HTMLElement>;
    if (folder.mode === "close") {
        arrowElement.classList.remove("open");
        arrowElement.classList.add("close");

        folderElement.classList.remove("library-type-folder-open");
        folderElement.classList.add("library-type-folder-close");
    } else {
        arrowElement.classList.remove("close");
        arrowElement.classList.add("open");

        folderElement.classList.remove("library-type-folder-close");
        folderElement.classList.add("library-type-folder-open");
    }
};