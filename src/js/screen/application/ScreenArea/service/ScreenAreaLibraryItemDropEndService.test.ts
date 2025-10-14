import { execute } from "./ScreenAreaLibraryItemDropEndService";
import { $SCREEN_ID } from "../../../../config/ScreenConfig";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("ScreenAreaLibraryItemDropEndServiceTest", () =>
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

    describe("スクリーンエリアの子要素のpointerEventsを解除する", () =>
    {
        it("子要素のpointerEvents='none'を空文字に戻す", () =>
        {
            // 子要素を作成してpointerEvents='none'を設定
            for (let idx = 0; idx < 5; ++idx) {
                const div = document.createElement("div");
                div.style.pointerEvents = "none";
                screenElement.appendChild(div);
            }

            // 実行前の確認
            for (let idx = 0; idx < 5; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("none");
            }

            execute();

            // 実行後の確認: pointerEventsが空文字に戻る
            for (let idx = 0; idx < 5; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("");
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
                div.style.pointerEvents = "none";
                screenElement.appendChild(div);
            }

            execute();

            for (let idx = 0; idx < 20; ++idx) {
                const node = screenElement.children[idx] as HTMLElement;
                expect(node.style.pointerEvents).toBe("");
            }
        });
    });

    describe("DisplayObjectのcanvas-containerのpointerEventsを解除する", () =>
    {
        it("display-object内のcanvas-containerのpointerEvents='none'を空文字に戻す", () =>
        {
            // DisplayObjectを作成
            for (let idx = 0; idx < 3; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";

                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";
                canvasContainer.style.pointerEvents = "none";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            // 実行前の確認
            const containersBefore = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containersBefore.length).toBe(3);
            for (let idx = 0; idx < 3; ++idx) {
                expect(containersBefore[idx].style.pointerEvents).toBe("none");
            }

            execute();

            // 実行後の確認: pointerEventsが空文字に戻る
            const containersAfter = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            for (let idx = 0; idx < 3; ++idx) {
                expect(containersAfter[idx].style.pointerEvents).toBe("");
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
            canvasContainer.style.pointerEvents = "none";
            displayObject2.appendChild(canvasContainer);
            screenElement.appendChild(displayObject2);

            expect(() => execute()).not.toThrow();

            // canvas-containerがない要素で処理が中断されるため、後続の要素は処理されない
            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(1);
            // 処理が中断されているため、pointerEventsは"none"のまま
            expect(containers[0].style.pointerEvents).toBe("none");
        });

        it("すべてのdisplay-objectにcanvas-containerがある場合は正常に処理される", () =>
        {
            // すべてのdisplay-objectにcanvas-containerを配置
            for (let idx = 0; idx < 3; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";
                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";
                canvasContainer.style.pointerEvents = "none";
                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(3);
            for (let idx = 0; idx < 3; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("");
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
                canvasContainer.style.pointerEvents = "none";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(10);
            for (let idx = 0; idx < 10; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("");
            }
        });
    });

    describe("統合テスト", () =>
    {
        it("子要素とcanvas-containerの両方のpointerEventsが同時に解除される", () =>
        {
            // 通常の子要素
            for (let idx = 0; idx < 3; ++idx) {
                const div = document.createElement("div");
                div.style.pointerEvents = "none";
                screenElement.appendChild(div);
            }

            // DisplayObject要素
            for (let idx = 0; idx < 2; ++idx) {
                const displayObject = document.createElement("div");
                displayObject.className = "display-object";

                const canvasContainer = document.createElement("div");
                canvasContainer.className = "canvas-container";
                canvasContainer.style.pointerEvents = "none";

                displayObject.appendChild(canvasContainer);
                screenElement.appendChild(displayObject);
            }

            execute();

            // 通常の子要素の確認
            expect(screenElement.children.length).toBe(5);
            for (let idx = 0; idx < 5; ++idx) {
                const child = screenElement.children[idx] as HTMLElement;
                expect(child.style.pointerEvents).toBe("");
            }

            // canvas-containerの確認
            const containers = screenElement.querySelectorAll(".canvas-container") as NodeListOf<HTMLElement>;
            expect(containers.length).toBe(2);
            for (let idx = 0; idx < 2; ++idx) {
                expect(containers[idx].style.pointerEvents).toBe("");
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

        it("pointerEventsが既に空文字の場合でも正常に動作する", () =>
        {
            const div = document.createElement("div");
            div.style.pointerEvents = "";
            screenElement.appendChild(div);

            const displayObject = document.createElement("div");
            displayObject.className = "display-object";
            const canvasContainer = document.createElement("div");
            canvasContainer.className = "canvas-container";
            canvasContainer.style.pointerEvents = "";
            displayObject.appendChild(canvasContainer);
            screenElement.appendChild(displayObject);

            expect(() => execute()).not.toThrow();

            const child = screenElement.children[0] as HTMLElement;
            expect(child.style.pointerEvents).toBe("");

            const container = screenElement.querySelector(".canvas-container") as HTMLElement;
            expect(container.style.pointerEvents).toBe("");
        });

        it("pointerEventsが'auto'など他の値の場合も空文字に戻る", () =>
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
            expect(child.style.pointerEvents).toBe("");

            const container = screenElement.querySelector(".canvas-container") as HTMLElement;
            expect(container.style.pointerEvents).toBe("");
        });
    });
});