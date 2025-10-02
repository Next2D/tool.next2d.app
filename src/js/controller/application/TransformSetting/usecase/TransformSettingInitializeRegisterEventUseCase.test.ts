import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TransformSettingInitializeRegisterEventUseCase";

// サービスとユースケースのモック
const mockTransformSettingInputPointerOverEventService = vi.fn();
const mockTransformSettingInputPointerOutEventService = vi.fn();
const mockTransformSettingHeightFocusInEventUseCase = vi.fn();
const mockTransformSettingWidthFocusInEventUseCase = vi.fn();
const mockTransformSettingXFocusInEventUseCase = vi.fn();
const mockTransformSettingYFocusInEventUseCase = vi.fn();
const mockTransformSettingScaleXFocusInEventUseCase = vi.fn();
const mockTransformSettingScaleYFocusInEventUseCase = vi.fn();
const mockTransformSettingWidthFocusOutEventUseCase = vi.fn();
const mockTransformSettingHeightFocusOutEventUseCase = vi.fn();
const mockTransformSettingInputKeyPressEventService = vi.fn();
const mockTransformSettingXPointerDownEventUseCase = vi.fn();
const mockTransformSettingYPointerDownEventUseCase = vi.fn();
const mockTransformSettingXFocusOutEventUseCase = vi.fn();
const mockTransformSettingYFocusOutEventUseCase = vi.fn();
const mockTransformSettingWidthPointerDownEventUseCase = vi.fn();
const mockTransformSettingHeightPointerDownEventUseCase = vi.fn();
const mockTransformSettingScaleXPointerDownEventUseCase = vi.fn();
const mockTransformSettingScaleYPointerDownEventUseCase = vi.fn();
const mockTransformSettingScaleXFocusOutEventUseCase = vi.fn();
const mockTransformSettingScaleYFocusOutEventUseCase = vi.fn();
const mockTransformSettingSizeLockPointerDownEventService = vi.fn();
const mockTransformSettingScaleLockPointerDownEventService = vi.fn();
const mockTransformSettingRotatePointerDownEventUseCase = vi.fn();
const mockTransformSettingRotateFocusInEventUseCase = vi.fn();
const mockTransformSettingRotateFocusOutEventUseCase = vi.fn();

vi.mock("../service/TransformSettingInputPointerOverEventService", () => ({
    execute: mockTransformSettingInputPointerOverEventService
}));

vi.mock("../service/TransformSettingInputPointerOutEventService", () => ({
    execute: mockTransformSettingInputPointerOutEventService
}));

vi.mock("./TransformSettingHeightFocusInEventUseCase", () => ({
    execute: mockTransformSettingHeightFocusInEventUseCase
}));

vi.mock("./TransformSettingWidthFocusInEventUseCase", () => ({
    execute: mockTransformSettingWidthFocusInEventUseCase
}));

vi.mock("./TransformSettingXFocusInEventUseCase", () => ({
    execute: mockTransformSettingXFocusInEventUseCase
}));

vi.mock("./TransformSettingYFocusInEventUseCase", () => ({
    execute: mockTransformSettingYFocusInEventUseCase
}));

vi.mock("./TransformSettingScaleXFocusInEventUseCase", () => ({
    execute: mockTransformSettingScaleXFocusInEventUseCase
}));

vi.mock("./TransformSettingScaleYFocusInEventUseCase", () => ({
    execute: mockTransformSettingScaleYFocusInEventUseCase
}));

vi.mock("./TransformSettingWidthFocusOutEventUseCase", () => ({
    execute: mockTransformSettingWidthFocusOutEventUseCase
}));

vi.mock("./TransformSettingHeightFocusOutEventUseCase", () => ({
    execute: mockTransformSettingHeightFocusOutEventUseCase
}));

vi.mock("../service/TransformSettingInputKeyPressEventService", () => ({
    execute: mockTransformSettingInputKeyPressEventService
}));

vi.mock("./TransformSettingXPointerDownEventUseCase", () => ({
    execute: mockTransformSettingXPointerDownEventUseCase
}));

vi.mock("./TransformSettingYPointerDownEventUseCase", () => ({
    execute: mockTransformSettingYPointerDownEventUseCase
}));

vi.mock("./TransformSettingXFocusOutEventUseCase", () => ({
    execute: mockTransformSettingXFocusOutEventUseCase
}));

vi.mock("./TransformSettingYFocusOutEventUseCase", () => ({
    execute: mockTransformSettingYFocusOutEventUseCase
}));

vi.mock("./TransformSettingWidthPointerDownEventUseCase", () => ({
    execute: mockTransformSettingWidthPointerDownEventUseCase
}));

vi.mock("./TransformSettingHeightPointerDownEventUseCase", () => ({
    execute: mockTransformSettingHeightPointerDownEventUseCase
}));

vi.mock("./TransformSettingScaleXPointerDownEventUseCase", () => ({
    execute: mockTransformSettingScaleXPointerDownEventUseCase
}));

vi.mock("./TransformSettingScaleYPointerDownEventUseCase", () => ({
    execute: mockTransformSettingScaleYPointerDownEventUseCase
}));

vi.mock("./TransformSettingScaleXFocusOutEventUseCase", () => ({
    execute: mockTransformSettingScaleXFocusOutEventUseCase
}));

vi.mock("./TransformSettingScaleYFocusOutEventUseCase", () => ({
    execute: mockTransformSettingScaleYFocusOutEventUseCase
}));

vi.mock("../service/TransformSettingSizeLockPointerDownEventService", () => ({
    execute: mockTransformSettingSizeLockPointerDownEventService
}));

vi.mock("../service/TransformSettingScaleLockPointerDownEventService", () => ({
    execute: mockTransformSettingScaleLockPointerDownEventService
}));

vi.mock("./TransformSettingRotatePointerDownEventUseCase", () => ({
    execute: mockTransformSettingRotatePointerDownEventUseCase
}));

vi.mock("./TransformSettingRotateFocusInEventUseCase", () => ({
    execute: mockTransformSettingRotateFocusInEventUseCase
}));

vi.mock("./TransformSettingRotateFocusOutEventUseCase", () => ({
    execute: mockTransformSettingRotateFocusOutEventUseCase
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_OVER: "pointerover",
        POINTER_OUT: "pointerout",
        POINTER_DOWN: "pointerdown"
    }
}));

vi.mock("@/config/TransformSettingConfig", () => ({
    $TRANSFORM_OBJECT_SIZE_LOCK_ID: "transform-object-size-lock",
    $TRANSFORM_OBJECT_X_ID: "transform-object-x",
    $TRANSFORM_OBJECT_Y_ID: "transform-object-y",
    $TRANSFORM_OBJECT_WIDTH_ID: "transform-object-width",
    $TRANSFORM_OBJECT_HEIGHT_ID: "transform-object-height",
    $TRANSFORM_OBJECT_SCALE_LOCK_ID: "transform-object-scale-lock",
    $TRANSFORM_OBJECT_SCALE_X_ID: "transform-object-scale-x",
    $TRANSFORM_OBJECT_SCALE_Y_ID: "transform-object-scale-y",
    $TRANSFORM_OBJECT_ROTATE_ID: "transform-object-rotate"
}));

describe("TransformSettingInitializeRegisterEventUseCase", () => {
    let sizeLockElement: HTMLElement;
    let xElement: HTMLElement;
    let yElement: HTMLElement;
    let widthElement: HTMLElement;
    let heightElement: HTMLElement;
    let scaleLockElement: HTMLElement;
    let scaleXElement: HTMLElement;
    let scaleYElement: HTMLElement;
    let rotateElement: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM要素の作成
        document.body.innerHTML = `
            <div id="transform-object-size-lock"></div>
            <input id="transform-object-x" type="text" />
            <input id="transform-object-y" type="text" />
            <input id="transform-object-width" type="text" />
            <input id="transform-object-height" type="text" />
            <div id="transform-object-scale-lock"></div>
            <input id="transform-object-scale-x" type="text" />
            <input id="transform-object-scale-y" type="text" />
            <input id="transform-object-rotate" type="text" />
        `;

        sizeLockElement = document.getElementById("transform-object-size-lock") as HTMLElement;
        xElement = document.getElementById("transform-object-x") as HTMLElement;
        yElement = document.getElementById("transform-object-y") as HTMLElement;
        widthElement = document.getElementById("transform-object-width") as HTMLElement;
        heightElement = document.getElementById("transform-object-height") as HTMLElement;
        scaleLockElement = document.getElementById("transform-object-scale-lock") as HTMLElement;
        scaleXElement = document.getElementById("transform-object-scale-x") as HTMLElement;
        scaleYElement = document.getElementById("transform-object-scale-y") as HTMLElement;
        rotateElement = document.getElementById("transform-object-rotate") as HTMLElement;
    });

    afterEach(() => {
        vi.resetAllMocks();
        document.body.innerHTML = "";
    });

    describe("正常系 - イベントリスナーの登録", () => {
        it("すべての要素にイベントリスナーが正しく登録される", () => {
            const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

            execute();

            // 各要素へのイベントリスナー登録回数を確認
            // sizeLock: 1イベント, x: 6イベント, y: 6イベント, width: 6イベント, height: 6イベント,
            // scaleLock: 1イベント, scaleX: 6イベント, scaleY: 6イベント, rotate: 6イベント
            // 合計: 1 + 6*7 + 1 = 44イベント
            expect(addEventListenerSpy).toHaveBeenCalledTimes(44);

            addEventListenerSpy.mockRestore();
        });

        it("sizeLock要素にPOINTER_DOWNイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(sizeLockElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "pointerdown",
                mockTransformSettingSizeLockPointerDownEventService
            );

            addEventListenerSpy.mockRestore();
        });

        it("x要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(xElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingXPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingXFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingXFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("y要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(yElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingYPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingYFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingYFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("width要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(widthElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingWidthPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingWidthFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingWidthFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("height要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(heightElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingHeightPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingHeightFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingHeightFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("scaleLock要素にPOINTER_DOWNイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(scaleLockElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                "pointerdown",
                mockTransformSettingScaleLockPointerDownEventService
            );

            addEventListenerSpy.mockRestore();
        });

        it("scaleX要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(scaleXElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingScaleXPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingScaleXFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingScaleXFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("scaleY要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(scaleYElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingScaleYPointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingScaleYFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingScaleYFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("rotate要素に6つのイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(rotateElement, "addEventListener");

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledTimes(6);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerover", mockTransformSettingInputPointerOverEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerout", mockTransformSettingInputPointerOutEventService);
            expect(addEventListenerSpy).toHaveBeenCalledWith("pointerdown", mockTransformSettingRotatePointerDownEventUseCase, { passive: false });
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusin", mockTransformSettingRotateFocusInEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("focusout", mockTransformSettingRotateFocusOutEventUseCase);
            expect(addEventListenerSpy).toHaveBeenCalledWith("keypress", mockTransformSettingInputKeyPressEventService);

            addEventListenerSpy.mockRestore();
        });

        it("pointerdown イベントに passive: false オプションが設定される", () => {
            const addEventListenerSpy = vi.spyOn(xElement, "addEventListener");

            execute();

            const pointerdownCall = addEventListenerSpy.mock.calls.find(
                call => call[0] === "pointerdown"
            );

            expect(pointerdownCall).toBeDefined();
            expect(pointerdownCall![2]).toEqual({ passive: false });

            addEventListenerSpy.mockRestore();
        });
    });

    describe("要素不存在時の動作", () => {
        it("sizeLock要素が存在しない場合、イベントは登録されない", () => {
            document.body.innerHTML = "";

            expect(() => execute()).not.toThrow();
        });

        it("x要素が存在しない場合、イベントは登録されない", () => {
            document.body.innerHTML = `
                <div id="transform-object-size-lock"></div>
                <input id="transform-object-y" type="text" />
            `;

            const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

            execute();

            // x要素がないので、x要素のイベント(6個)が登録されない
            // sizeLock: 1, y: 6 = 7
            expect(addEventListenerSpy).toHaveBeenCalledTimes(7);

            addEventListenerSpy.mockRestore();
        });

        it("すべての要素が存在しない場合、エラーなく終了する", () => {
            document.body.innerHTML = "";

            expect(() => execute()).not.toThrow();
        });

        it("一部の要素のみ存在する場合、存在する要素のみイベント登録される", () => {
            document.body.innerHTML = `
                <input id="transform-object-x" type="text" />
                <input id="transform-object-width" type="text" />
            `;

            const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

            execute();

            // x: 6, width: 6 = 12
            expect(addEventListenerSpy).toHaveBeenCalledTimes(12);

            addEventListenerSpy.mockRestore();
        });
    });

    describe("イベントハンドラーの呼び出し", () => {
        it("登録されたイベントハンドラーが正しく動作する", () => {
            execute();

            // pointerover イベントをトリガー
            const pointeroverEvent = new PointerEvent("pointerover");
            xElement.dispatchEvent(pointeroverEvent);

            expect(mockTransformSettingInputPointerOverEventService).toHaveBeenCalledWith(pointeroverEvent);
        });

        it("focusinイベントが正しく発火する", () => {
            execute();

            const focusinEvent = new FocusEvent("focusin");
            xElement.dispatchEvent(focusinEvent);

            expect(mockTransformSettingXFocusInEventUseCase).toHaveBeenCalledWith(focusinEvent);
        });

        it("focusoutイベントが正しく発火する", () => {
            execute();

            const focusoutEvent = new FocusEvent("focusout");
            widthElement.dispatchEvent(focusoutEvent);

            expect(mockTransformSettingWidthFocusOutEventUseCase).toHaveBeenCalledWith(focusoutEvent);
        });

        it("keypressイベントが正しく発火する", () => {
            execute();

            const keypressEvent = new KeyboardEvent("keypress", { key: "Enter" });
            heightElement.dispatchEvent(keypressEvent);

            expect(mockTransformSettingInputKeyPressEventService).toHaveBeenCalledWith(keypressEvent);
        });

        it("pointerdownイベントが正しく発火する", () => {
            execute();

            const pointerdownEvent = new PointerEvent("pointerdown");
            sizeLockElement.dispatchEvent(pointerdownEvent);

            expect(mockTransformSettingSizeLockPointerDownEventService).toHaveBeenCalledWith(pointerdownEvent);
        });
    });

    describe("複数回実行時の動作", () => {
        it("複数回実行しても重複してイベントが登録される", () => {
            const addEventListenerSpy = vi.spyOn(HTMLElement.prototype, "addEventListener");

            execute();
            const firstCallCount = addEventListenerSpy.mock.calls.length;

            execute();
            const secondCallCount = addEventListenerSpy.mock.calls.length;

            // 2回目の実行で同じ数のイベントリスナーが追加される
            expect(secondCallCount).toBe(firstCallCount * 2);

            addEventListenerSpy.mockRestore();
        });

        it("複数回実行後、イベントハンドラーが複数回呼ばれる", () => {
            execute();
            execute();

            const pointeroverEvent = new PointerEvent("pointerover");
            xElement.dispatchEvent(pointeroverEvent);

            // 2回登録されているので2回呼ばれる
            expect(mockTransformSettingInputPointerOverEventService).toHaveBeenCalledTimes(2);
        });
    });

    describe("エッジケース", () => {
        it("要素が削除された後に実行してもエラーにならない", () => {
            document.body.innerHTML = "";

            expect(() => execute()).not.toThrow();
        });

        it("Documentがnullでないことを確認", () => {
            expect(document).toBeDefined();
            expect(document.getElementById).toBeDefined();
        });

        it("getElementByIdがnullを返すケースに対応している", () => {
            const getElementByIdSpy = vi.spyOn(document, "getElementById");
            getElementByIdSpy.mockReturnValue(null);

            expect(() => execute()).not.toThrow();

            getElementByIdSpy.mockRestore();
        });
    });

    describe("パフォーマンステスト", () => {
        it("イベント登録が高速に完了する", () => {
            const start = performance.now();
            execute();
            const end = performance.now();
            const duration = end - start;

            // イベント登録が10ms以内で完了することを期待
            expect(duration).toBeLessThan(10);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：すべての要素でイベントが動作する", () => {
            execute();

            // 各要素でイベントをトリガー
            const pointeroverEvent = new PointerEvent("pointerover");
            xElement.dispatchEvent(pointeroverEvent);
            yElement.dispatchEvent(pointeroverEvent);
            widthElement.dispatchEvent(pointeroverEvent);
            heightElement.dispatchEvent(pointeroverEvent);
            scaleXElement.dispatchEvent(pointeroverEvent);
            scaleYElement.dispatchEvent(pointeroverEvent);
            rotateElement.dispatchEvent(pointeroverEvent);

            // 各要素で1回ずつ、合計7回呼ばれる
            expect(mockTransformSettingInputPointerOverEventService).toHaveBeenCalledTimes(7);
        });

        it("異なるイベントが順次発火するシナリオ", () => {
            execute();

            // pointerover -> focusin -> keypress -> focusout -> pointerout
            xElement.dispatchEvent(new PointerEvent("pointerover"));
            xElement.dispatchEvent(new FocusEvent("focusin"));
            xElement.dispatchEvent(new KeyboardEvent("keypress", { key: "1" }));
            xElement.dispatchEvent(new FocusEvent("focusout"));
            xElement.dispatchEvent(new PointerEvent("pointerout"));

            expect(mockTransformSettingInputPointerOverEventService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingXFocusInEventUseCase).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingInputKeyPressEventService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingXFocusOutEventUseCase).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingInputPointerOutEventService).toHaveBeenCalledTimes(1);
        });

        it("ロック要素のクリックシナリオ", () => {
            execute();

            // サイズロックとスケールロックをクリック
            sizeLockElement.dispatchEvent(new PointerEvent("pointerdown"));
            scaleLockElement.dispatchEvent(new PointerEvent("pointerdown"));

            expect(mockTransformSettingSizeLockPointerDownEventService).toHaveBeenCalledTimes(1);
            expect(mockTransformSettingScaleLockPointerDownEventService).toHaveBeenCalledTimes(1);
        });
    });

    describe("イベントリスナー登録の詳細確認", () => {
        it("各入力要素に同じPointerOverサービスが登録される", () => {
            const elements = [xElement, yElement, widthElement, heightElement, scaleXElement, scaleYElement, rotateElement];
            const spies = elements.map(el => vi.spyOn(el, "addEventListener"));

            execute();

            spies.forEach(spy => {
                const pointeroverCall = spy.mock.calls.find(call => call[0] === "pointerover");
                expect(pointeroverCall).toBeDefined();
                expect(pointeroverCall![1]).toBe(mockTransformSettingInputPointerOverEventService);
            });

            spies.forEach(spy => spy.mockRestore());
        });

        it("各入力要素に同じPointerOutサービスが登録される", () => {
            const elements = [xElement, yElement, widthElement, heightElement, scaleXElement, scaleYElement, rotateElement];
            const spies = elements.map(el => vi.spyOn(el, "addEventListener"));

            execute();

            spies.forEach(spy => {
                const pointeroutCall = spy.mock.calls.find(call => call[0] === "pointerout");
                expect(pointeroutCall).toBeDefined();
                expect(pointeroutCall![1]).toBe(mockTransformSettingInputPointerOutEventService);
            });

            spies.forEach(spy => spy.mockRestore());
        });

        it("各入力要素に同じKeyPressサービスが登録される", () => {
            const elements = [xElement, yElement, widthElement, heightElement, scaleXElement, scaleYElement, rotateElement];
            const spies = elements.map(el => vi.spyOn(el, "addEventListener"));

            execute();

            spies.forEach(spy => {
                const keypressCall = spy.mock.calls.find(call => call[0] === "keypress");
                expect(keypressCall).toBeDefined();
                expect(keypressCall![1]).toBe(mockTransformSettingInputKeyPressEventService);
            });

            spies.forEach(spy => spy.mockRestore());
        });

        it("各入力要素に異なるPointerDownハンドラーが登録される", () => {
            execute();

            const xSpy = vi.spyOn(xElement, "addEventListener");
            const ySpy = vi.spyOn(yElement, "addEventListener");

            // 既に登録されているので、もう一度実行して確認
            execute();

            const xPointerdownCall = xSpy.mock.calls.find(call => call[0] === "pointerdown");
            const yPointerdownCall = ySpy.mock.calls.find(call => call[0] === "pointerdown");

            expect(xPointerdownCall![1]).toBe(mockTransformSettingXPointerDownEventUseCase);
            expect(yPointerdownCall![1]).toBe(mockTransformSettingYPointerDownEventUseCase);
            expect(xPointerdownCall![1]).not.toBe(yPointerdownCall![1]);

            xSpy.mockRestore();
            ySpy.mockRestore();
        });
    });
});
