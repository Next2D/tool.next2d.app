/**
 * @class
 */
class JavascriptController
{
    /**
     * @return {void}
     * @method
     * @public
     */
    reload ()
    {
        const element = document
            .getElementById("javascript-internal-list-box");

        if (!element) {
            return;
        }

        // 表示リストを初期化
        const children = element.children;
        while (children.length) {
            children[0].remove();
        }

        const workSpaces = Util.$currentWorkSpace();

        for (const instance of workSpaces._$libraries.values()) {

            if (instance._$type !== "container") {
                continue;
            }

            if (!instance._$actions.size) {
                continue;
            }

            const id = instance.id;
            const parentTag = `<div id="script-${id}" data-library-id="${id}" class="internal-parent"><i></i>${instance._$name}</div>`;

            element.insertAdjacentHTML("beforeend", parentTag);

            const parentElement = document
                .getElementById(`script-${id}`);

            // eslint-disable-next-line no-loop-func
            parentElement.addEventListener("dblclick", (event) =>
            {
                Util.$sceneChange.reload(
                    event.currentTarget.dataset.libraryId | 0
                );
            });

            for (const frame of instance._$actions.keys()) {

                const childTag = `<div id="script-${id}-${frame}" data-library-id="${id}" data-frame="${frame}" class="internal-child"><i></i>frame ${frame}</div>`;

                element.insertAdjacentHTML("beforeend", childTag);

                const childElement = document
                    .getElementById(`script-${id}-${frame}`);

                // eslint-disable-next-line no-loop-func
                childElement.addEventListener("mousedown", (event) =>
                {
                    Util.$javaScriptEditor.hide();

                    const target = event.currentTarget;

                    const scene = Util
                        .$currentWorkSpace()
                        .getLibrary(target.dataset.libraryId | 0);

                    const frame = target.dataset.frame | 0;
                    Util.$javaScriptEditor.show(null, frame, scene);
                });
            }

        }
    }
}

Util.$javascriptController = new JavascriptController();
