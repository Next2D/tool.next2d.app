import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ReferenceSettingInitializeRegisterEventUseCase";

// モック設定
const mockReferenceSettingBoxPointerDownUseCase = vi.fn();
const mockReferenceSettingPointerOverEventService = vi.fn();
const mockReferenceSettingPointerOutEventService = vi.fn();
const mockReferenceSettingXPointerDownUseCase = vi.fn();
const mockReferenceSettingYPointerDownUseCase = vi.fn();
const mockReferenceSettingInputKeyPressEventService = vi.fn();
const mockReferenceSettingXFocusInEventService = vi.fn();
const mockReferenceSettingYFocusInEventService = vi.fn();
const mockReferenceSettingXFocusOutEventUseCase = vi.fn();
const mockReferenceSettingYFocusOutEventUseCase = vi.fn();

vi.mock("./ReferenceSettingBoxPointerDownUseCase", () => ({
    execute: mockReferenceSettingBoxPointerDownUseCase
}));

vi.mock("../service/ReferenceSettingPointerOverEventService", () => ({
    execute: mockReferenceSettingPointerOverEventService
}));

vi.mock("../service/ReferenceSettingPointerOutEventService", () => ({
    execute: mockReferenceSettingPointerOutEventService
}));

vi.mock("./ReferenceSettingXPointerDownUseCase", () => ({
    execute: mockReferenceSettingXPointerDownUseCase
}));

vi.mock("./ReferenceSettingYPointerDownUseCase", () => ({
    execute: mockReferenceSettingYPointerDownUseCase
}));

vi.mock("../service/ReferenceSettingInputKeyPressEventService", () => ({
    execute: mockReferenceSettingInputKeyPressEventService
}));

vi.mock("../service/ReferenceSettingXFocusInEventService", () => ({
    execute: mockReferenceSettingXFocusInEventService
}));

vi.mock("../service/ReferenceSettingYFocusInEventService", () => ({
    execute: mockReferenceSettingYFocusInEventService
}));

vi.mock("./ReferenceSettingXFocusOutEventUseCase", () => ({
    execute: mockReferenceSettingXFocusOutEventUseCase
}));

vi.mock("./ReferenceSettingYFocusOutEventUseCase", () => ({
    execute: mockReferenceSettingYFocusOutEventUseCase
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_DOWN: "pointerdown",
        POINTER_OVER: "pointerover",
        POINTER_OUT: "pointerout"
    }
}));

vi.mock("@/config/ReferenceSettingConfig", () => ({
    $REFERENCE_SETTING_BOX_ID: "reference-setting-box",
    $TRANSFORM_REFERENCE_X_ID: "transform-reference-x",
    $TRANSFORM_REFERENCE_Y_ID: "transform-reference-y"
}));

describe("ReferenceSettingInitializeRegisterEventUseCase", () => {
    let mockReferenceSettingBox: HTMLElement;
    let mockTransformReferenceX: HTMLElement;
    let mockTransformReferenceY: HTMLElement;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM要素のモック作成
        mockReferenceSettingBox = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        } as any;

        mockTransformReferenceX = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        } as any;

        mockTransformReferenceY = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        } as any;

        // document.getElementById のモック設定
        const originalGetElementById = document.getElementById;
        document.getElementById = vi.fn().mockImplementation((id: string) => {
            switch (id) {
                case "reference-setting-box":
                    return mockReferenceSettingBox;
                case "transform-reference-x":
                    return mockTransformReferenceX;
                case "transform-reference-y":
                    return mockTransformReferenceY;
                default:
                    return originalGetElementById.call(document, id);
            }
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("正常系", () => {
        it("全ての要素が存在する場合、すべてのイベントリスナーが登録される", () => {
            execute();

            // ReferenceSettingBox のイベント登録確認
            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingBoxPointerDownUseCase
            );

            // TransformReferenceX のイベント登録確認
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "pointerover",
                mockReferenceSettingPointerOverEventService
            );
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "pointerout",
                mockReferenceSettingPointerOutEventService
            );
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingXPointerDownUseCase,
                { "passive": false }
            );
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "focusin",
                mockReferenceSettingXFocusInEventService
            );
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockReferenceSettingXFocusOutEventUseCase
            );
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "keypress",
                mockReferenceSettingInputKeyPressEventService
            );

            // TransformReferenceY のイベント登録確認
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "pointerover",
                mockReferenceSettingPointerOverEventService
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "pointerout",
                mockReferenceSettingPointerOutEventService
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingYPointerDownUseCase,
                { "passive": false }
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "focusin",
                mockReferenceSettingYFocusInEventService
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockReferenceSettingYFocusOutEventUseCase
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "keypress",
                mockReferenceSettingInputKeyPressEventService
            );
        });

        it("イベントリスナーの呼び出し回数が正しい", () => {
            execute();

            // ReferenceSettingBox: 1つのイベント
            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledTimes(1);

            // TransformReferenceX: 6つのイベント
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledTimes(6);

            // TransformReferenceY: 6つのイベント
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledTimes(6);
        });
    });

    describe("要素が存在しない場合", () => {
        it("referenceSettingBoxが存在しない場合はイベント登録されない", () => {
            document.getElementById = vi.fn().mockImplementation((id: string) => {
                switch (id) {
                    case "reference-setting-box":
                        return null;
                    case "transform-reference-x":
                        return mockTransformReferenceX;
                    case "transform-reference-y":
                        return mockTransformReferenceY;
                    default:
                        return null;
                }
            });

            execute();

            expect(mockReferenceSettingBox.addEventListener).not.toHaveBeenCalled();
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledTimes(6);
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledTimes(6);
        });

        it("transformReferenceXが存在しない場合はX座標関連のイベント登録されない", () => {
            document.getElementById = vi.fn().mockImplementation((id: string) => {
                switch (id) {
                    case "reference-setting-box":
                        return mockReferenceSettingBox;
                    case "transform-reference-x":
                        return null;
                    case "transform-reference-y":
                        return mockTransformReferenceY;
                    default:
                        return null;
                }
            });

            execute();

            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledTimes(1);
            expect(mockTransformReferenceX.addEventListener).not.toHaveBeenCalled();
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledTimes(6);
        });

        it("transformReferenceYが存在しない場合はY座標関連のイベント登録されない", () => {
            document.getElementById = vi.fn().mockImplementation((id: string) => {
                switch (id) {
                    case "reference-setting-box":
                        return mockReferenceSettingBox;
                    case "transform-reference-x":
                        return mockTransformReferenceX;
                    case "transform-reference-y":
                        return null;
                    default:
                        return null;
                }
            });

            execute();

            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledTimes(1);
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledTimes(6);
            expect(mockTransformReferenceY.addEventListener).not.toHaveBeenCalled();
        });

        it("すべての要素が存在しない場合はイベント登録されない", () => {
            document.getElementById = vi.fn().mockReturnValue(null);

            execute();

            expect(mockReferenceSettingBox.addEventListener).not.toHaveBeenCalled();
            expect(mockTransformReferenceX.addEventListener).not.toHaveBeenCalled();
            expect(mockTransformReferenceY.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe("イベントタイプとオプションの確認", () => {
        it("pointerdownイベントにpassive:falseオプションが設定される", () => {
            execute();

            // X座標入力のpointerdownイベント
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingXPointerDownUseCase,
                { "passive": false }
            );

            // Y座標入力のpointerdownイベント
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingYPointerDownUseCase,
                { "passive": false }
            );
        });

        it("referenceSettingBoxのpointerdownイベントにはオプションが設定されない", () => {
            execute();

            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingBoxPointerDownUseCase
            );
            
            // オプションが渡されていないことを確認
            const calls = (mockReferenceSettingBox.addEventListener as any).mock.calls;
            expect(calls[0]).toHaveLength(2); // イベントタイプとハンドラーのみ
        });
    });

    describe("イベントハンドラーの対応確認", () => {
        it("X座標とY座標で異なるハンドラーが使用される", () => {
            execute();

            // X座標とY座標で異なるpointerdownハンドラー
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingXPointerDownUseCase,
                { "passive": false }
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockReferenceSettingYPointerDownUseCase,
                { "passive": false }
            );

            // X座標とY座標で異なるfocusin/focusoutハンドラー
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "focusin",
                mockReferenceSettingXFocusInEventService
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "focusin",
                mockReferenceSettingYFocusInEventService
            );

            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockReferenceSettingXFocusOutEventUseCase
            );
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                "focusout",
                mockReferenceSettingYFocusOutEventUseCase
            );
        });

        it("X座標とY座標で同じハンドラーが使用されるイベント", () => {
            execute();

            // 共通のハンドラーを使用するイベント
            const sharedEvents = [
                ["pointerover", mockReferenceSettingPointerOverEventService],
                ["pointerout", mockReferenceSettingPointerOutEventService],
                ["keypress", mockReferenceSettingInputKeyPressEventService]
            ];

            sharedEvents.forEach(([eventType, handler]) => {
                expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledWith(
                    eventType,
                    handler
                );
                expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledWith(
                    eventType,
                    handler
                );
            });
        });
    });

    describe("DOM操作の検証", () => {
        it("document.getElementByIdが正しいIDで呼ばれる", () => {
            const getElementByIdSpy = vi.spyOn(document, "getElementById");

            execute();

            expect(getElementByIdSpy).toHaveBeenCalledWith("reference-setting-box");
            expect(getElementByIdSpy).toHaveBeenCalledWith("transform-reference-x");
            expect(getElementByIdSpy).toHaveBeenCalledWith("transform-reference-y");
            expect(getElementByIdSpy).toHaveBeenCalledTimes(3);
        });
    });

    describe("複数回実行の検証", () => {
        it("複数回実行してもイベントが重複登録される", () => {
            execute();
            execute();

            // 2回実行されるので、すべてのイベントが2回ずつ登録される
            expect(mockReferenceSettingBox.addEventListener).toHaveBeenCalledTimes(2);
            expect(mockTransformReferenceX.addEventListener).toHaveBeenCalledTimes(12); // 6 × 2
            expect(mockTransformReferenceY.addEventListener).toHaveBeenCalledTimes(12); // 6 × 2
        });
    });
});
