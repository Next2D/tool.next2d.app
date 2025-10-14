import { execute } from "./ScreenAreaLibraryItemDropStartService";
import { $SCREEN_ID } from "../../../../config/ScreenConfig";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("ScreenAreaLibraryItemDropStartServiceTest", () =>
{
    let screenElement: HTMLElement;

    beforeEach(() =>
    {
        screenElement = document.createElement("div");
        screenElement.id = $SCREEN_ID;
        document.body.appendChild(screenElement);
    });

    afterEach(() =>
    {
        screenElement.remove();
    });

    describe("スクリーンエリアの子要素のpointerEventsを無効化する", () =>
    {
        it("子要素のpointerEventsを'none'に設定する", () =>
        {
            // 子要素を作成（初期状態は空文字）
            for (let idx = 0; idx < 5; ++idx) {
                const div = document.createElement("div");
                screenElement.appendChild(div);
            }

            // 実行前の確認
            for (let idx = 0; idx < 5; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("");
            }

            execute();

            // 実行後の確認: pointerEventsが'none'になる
            for (let idx = 0; idx < 5; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("none");
            }
        });

        it("子要素が0個の場合でもエラーにならない", () =>
        {
            expect(() => execute()).not.toThrow();
        });

        it("子要素が多数ある場合でも正しく処理される", () =>
        {
            for (let idx = 0; idx < 20; ++idx) {
                const div = document.createElement("div");
                screenElement.appendChild(div);
            }

            execute();

            for (let idx = 0; idx < 20; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("none");
            }
        });

        it("nullの子要素がある場合はスキップされる", () =>
        {
            // 通常の子要素
            for (let idx = 0; idx < 3; ++idx) {
                const div = document.createElement("div");
                screenElement.appendChild(div);
            }

            execute();

            // null以外の要素は正しく処理される
            for (let idx = 0; idx < 3; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("none");
            }
        });
    });

    describe("DisplayObjectのcanvas-containerのpointerEventsを無効化する", () =>
    {
        it("display-object内のcanvas-containerのpointerEventsを'none'に設定する", () =>
        {
            // DisplayObjectを作成
            for (let idx = 0; idx < 3; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";

                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            // 実行前の確認
            const containersBefore = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containersBefore.length).toBe(3);
            for (let idx = 0; idx < 3; ++idx) {
                expect(containersBefore[idx].style.pointerEvents).toBe("");
            }

            execute();

            // 実行後の確認: pointerEventsが'none'になる
            const containersAfter = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            for (let idx = 0; idx < 3; ++idx) {
                expect(containersAfter[idx].style.pointerEvents).toBe("none");
            }
        });

        it("canvas-containerが存在しないdisplay-objectがあると処理が中断される", () =>
        {
            // canvas-containerなしのdisplay-object（先に配置）
            const displayObject1 = document.createElement("div");
            displayObject1.className = "display-object";
            screenElement.appendChild(displayObject1);

            // canvas-containerありのdisplay-object（後に配置）
            const displayObject2 = document.createElement("div");
            displayObject2.className = "display-object";
            const canvasContainer = document.createElement("div");
            canvasContainer.className = "canvas-container";
            displayObject2.appendChild(canvasContainer);
            screenElement.appendChild(displayObject2);

            expect(() => execute()).not.toThrow();

            // canvas-containerがない要素で処理が中断されるため、後続の要素は処理されない
            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(1);
            // 処理が中断されているため、pointerEventsは空文字のまま
            expect(containers[0].style.pointerEvents).toBe("");
        });

        it("すべてのdisplay-objectにcanvas-containerがある場合は正常に処理される", () =>
        {
            // すべてのdisplay-objectにcanvas-containerを配置
            for (let idx = 0; idx < 3; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";
                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";
                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(3);
            for (let idx = 0; idx < 3; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("none");
            }
        });

        it("display-objectが0個の場合でもエラーにならない", () =>
        {
            expect(() => execute()).not.toThrow();
        });

        it("複数のcanvas-containerがあっても正しく処理される", () =>
        {
            for (let idx = 0; idx < 10; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";

                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(10);
            for (let idx = 0; idx < 10; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("none");
            }
        });

        it("nullのdisplay-objectがある場合はスキップされる", () =>
        {
            // 通常のdisplay-object
            for (let idx = 0; idx < 2; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";
                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";
                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            // null以外の要素は正しく処理される
            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(2);
            for (let idx = 0; idx < 2; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("none");
            }
        });
    });

    describe("統合テスト", () =>
    {
        it("子要素とcanvas-containerの両方のpointerEventsが同時に無効化される", () =>
        {
            // 通常の子要素
            for (let idx = 0; idx < 3; ++idx) {
                const div = document.createElement("div");
                screenElement.appendChild(div);
            }

            // DisplayObject要素
            for (let idx = 0; idx < 2; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";

                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            // 通常の子要素の確認
            expect(screenElement.children.length).toBe(5);
            for (let idx = 0; idx < 5; ++idx) {
                const child = screenElement.children[idx] as HTMLElement;
                expect(child.style.pointerEvents).toBe("none");
            }

            // canvas-containerの確認
            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(2);
            for (let idx = 0; idx < 2; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("none");
            }
        });
    });

    describe("エッジケース", () =>
    {
        it("スクリーンエリアが存在しない場合は何もしない", () =>
        {
            screenElement.remove();
            expect(() => execute()).not.toThrow();
        });

        it("pointerEventsが既に'none'の場合でも正常に動作する", () =>
        {
            const div = document.createElement("div");
            div.style.pointerEvents = "none";
            screenElement.appendChild(div);

            const displayObject = document.createElement("div");
            displayObject.className = "display-object";
            const canvasContainer = document.createElement("div");
            canvasContainer.className = "canvas-container";
            canvasContainer.style.pointerEvents = "none";
            displayObject.appendChild(canvasContainer);
            screenElement.appendChild(displayObject);

            expect(() => execute()).not.toThrow();

            const child = screenElement.children[0] as HTMLElement;
            expect(child.style.pointerEvents).toBe("none");

            const container = screenElement.querySelector(".canvas-container") as HTMLElement;
            expect(container.style.pointerEvents).toBe("none");
        });

        it("pointerEventsが'auto'など他の値の場合も'none'に変更される", () =>
        {
            const div = document.createElement("div");
            div.style.pointerEvents = "auto";
            screenElement.appendChild(div);

            const displayObject = document.createElement("div");
            displayObject.className = "display-object";
            const canvasContainer = document.createElement("div");
            canvasContainer.className = "canvas-container";
            canvasContainer.style.pointerEvents = "auto";
            displayObject.appendChild(canvasContainer);
            screenElement.appendChild(displayObject);

            execute();

            const child = screenElement.children[0] as HTMLElement;
            expect(child.style.pointerEvents).toBe("none");

            const container = screenElement.querySelector(".canvas-container") as HTMLElement;
            expect(container.style.pointerEvents).toBe("none");
        });
    });
});