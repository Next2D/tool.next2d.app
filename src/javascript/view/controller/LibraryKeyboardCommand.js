/**
 * @class
 * @extends {KeyboardCommand}
 */
class LibraryKeyboardCommand extends KeyboardCommand
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
    }

    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();

        const element = document
            .getElementById("library-list-box");

        if (element) {

            element.addEventListener("mouseleave", () =>
            {
                this.active = false;
            });

            element.addEventListener("mouseover", () =>
            {
                if (!this.active) {
                    this.active = true;
                }
            });
        }

        // 初期イベント登録
        this.add("Delete", this.executeInstanceDelete);
        this.add("Backspace", this.executeInstanceDelete);
    }

    /**
     * @description 削除を実行
     *
     * @return {void}
     * @method
     * @public
     */
    executeInstanceDelete ()
    {
        Util.$libraryMenu.executeLibraryMenuDelete();
    }
}

Util.$libraryKeyboardCommand = new LibraryKeyboardCommand();
