/**
 * @class
 */
class UserSetting
{
    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        const toolsSetting = document
            .getElementById("tools-setting");

        if (toolsSetting) {
            toolsSetting
                .addEventListener("click", (event) =>
                {
                    this.show(event);
                });
        }

        const object = this.getPublishSetting();

        const layerElement = document
            .getElementById("publish-layer-setting");

        if (layerElement) {
            layerElement
                .children[object.layer ? 1 : 0]
                .selected = true;

            layerElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getPublishSetting();
                    object.layer = event.target.value === "1";

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }

        const typeElement = document
            .getElementById("publish-type-setting");

        if (typeElement) {
            for (let idx = 0; idx < typeElement.children.length; ++idx) {

                const node = typeElement.children[idx];
                if (object.type !== node.value) {
                    continue;
                }

                node.selected = true;
                break;
            }

            typeElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getPublishSetting();
                    object.type  = event.target.value;

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }

        const modalElement = document
            .getElementById("modal-setting");

        if (modalElement) {

            if ("modal" in object) {
                modalElement.children[object.modal ? 0 : 1].selected = true;
            }

            modalElement
                .addEventListener("change", (event) =>
                {
                    const object = this.getPublishSetting();
                    object.modal = event.target.value === "1";

                    localStorage
                        .setItem(
                            `${Util.PREFIX}@user-publish-setting`,
                            JSON.stringify(object)
                        );

                });
        }

        const shortcutSetting = document
            .getElementById("shortcut-setting");

        if (shortcutSetting) {
            shortcutSetting
                .addEventListener("click", (event) =>
                {
                    Util.$shortcutSetting.show(event);
                });
        }
    }

    /**
     * @description 書き出し設定オブジェクトを返す
     *
     * @return {object}
     * @method
     * @public
     */
    getPublishSetting ()
    {
        const object = localStorage
            .getItem(`${Util.PREFIX}@user-publish-setting`);

        if (object) {
            return JSON.parse(object);
        }

        return {
            "layer": false,
            "type": "zlib"
        };
    }

    /**
     * @description ユーザー設定モーダルを表示
     *
     * @return {object}
     * @method
     * @public
     */
    show ()
    {
        const element = document
            .getElementById("user-setting");

        if (element.classList.contains("fadeIn")) {

            Util.$endMenu();

        } else {

            Util.$endMenu("user-setting");
            const toolsSetting = document
                .getElementById("tools-setting");

            element.style.display = "";
            element.style.left = `${toolsSetting.offsetLeft + 30}px`;
            element.style.top  = `${toolsSetting.offsetTop - element.clientHeight + 80}px`;

            element.setAttribute("class", "fadeIn");
        }
    }
}

Util.$userSetting = new UserSetting();
