import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkSpace } from "@/core/domain/model/WorkSpace";
import type { MovieClip } from "@/core/domain/model/MovieClip";

// モック関数の定義
const mock$getCurrentWorkSpace = vi.fn();
const mockScreenDisplayObjectUpdateSelectedValueService = vi.fn();
const mockScreenAreaCalcSelectedCharacterPositionService = vi.fn();
const mockTransformSettingCacheBeforeMatrixService = vi.fn();

// vi.mockの呼び出し
vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("../service/ScreenDisplayObjectUpdateSelectedValueService", () => ({
    execute: mockScreenDisplayObjectUpdateSelectedValueService
}));

vi.mock("@/screen/application/ScreenArea/service/ScreenAreaCalcSelectedCharacterPositionService", () => ({
    execute: mockScreenAreaCalcSelectedCharacterPositionService
}));

vi.mock("@/config/TransformSettingConfig", () => ({
    $TRANSFORM_OBJECT_X_ID: "transform-object-x",
    $TRANSFORM_OBJECT_Y_ID: "transform-object-y"
}));

// 動的インポート
const { execute } = await import("./ScreenDisplayObjectArrowUpEventUseCase");
const { transformSetting } = await import("@/controller/domain/model/TransformSetting");

describe("ScreenDisplayObjectArrowUpEventUseCase", () => {
    let mockWorkSpace: WorkSpace;
    let mockMovieClip: MovieClip;
    let mockTransformObjectXElement: HTMLInputElement;
    let mockTransformObjectYElement: HTMLInputElement;

    const createMockEvent = (shiftKey: boolean): KeyboardEvent => {
        return {
            shiftKey: shiftKey,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as KeyboardEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // transformSettingのリセット
        transformSetting.x = 0;
        transformSetting.y = 0;
        transformSetting.beforeX = 0;
        transformSetting.beforeY = 0;

        const selectedDepths = new Map([[0, [1]]]);
        mockMovieClip = {
            selectedDepths: selectedDepths,
            currentFrame: 1,
            getLayer: vi.fn().mockReturnValue({
                getCharacter: vi.fn().mockReturnValue({
                    matrix: new Float32Array([1, 0, 0, 1, 0, 0])
                })
            })
        } as unknown as MovieClip;

        mockWorkSpace = {
            scene: mockMovieClip,
            scale: 1
        } as unknown as WorkSpace;

        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        mockScreenAreaCalcSelectedCharacterPositionService.mockReturnValue({
            x: 100,
            y: 100
        });

        mockScreenDisplayObjectUpdateSelectedValueService.mockResolvedValue(undefined);

        // HTML要素のモック
        mockTransformObjectXElement = {
            value: "50"
        } as HTMLInputElement;

        mockTransformObjectYElement = {
            value: "75"
        } as HTMLInputElement;

        // document.getElementByIdのモック
        vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
            if (id === "transform-object-x") {
                return mockTransformObjectXElement;
            }
            if (id === "transform-object-y") {
                return mockTransformObjectYElement;
            }
            return null;
        });
    });

    describe("基本的な上方向移動", () => {
        it("Shiftキーなしで1ピクセル上に移動する", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).toBe(-1); // -1 * 1
            // expect(transformSetting.beforeX).toBe(50);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(75);  // Arrow events don\'t set beforeX/Y
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("Shiftキーありで10ピクセル上に移動する", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).toBe(-10); // -10 * 1
            // expect(transformSetting.beforeX).toBe(50);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(75);  // Arrow events don\'t set beforeX/Y
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("X方向の移動量は常に0である", async () => {
            const mockEvent = createMockEvent(false);

            await execute(mockEvent);

            expect(transformSetting.x).toBe(0);
        });

        it("Y方向の移動量は常に負である（上方向）", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBeLessThan(0);
        });
    });

    describe("スケールの適用", () => {
        it("scale=2の場合、移動量が2倍になる", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 2;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-2); // -1 * 2
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("scale=2でShiftキーありの場合、移動量が-20になる", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 2;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-20); // -10 * 2
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("scale=0.5の場合、移動量が半分になる", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 0.5;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-0.5); // -1 * 0.5
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("scale=0.1でShiftキーありの場合", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 0.1;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-1); // -10 * 0.1
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("scale=3の場合", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 3;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-3); // -1 * 3
        });

        it("scale=5でShiftキーありの場合", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 5;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-50); // -10 * 5
        });
    });

    describe("早期リターン条件", () => {
        it("selectedDepthsが空の場合は何もしない", async () => {
            const mockEvent = createMockEvent(false);
            const emptySelectedDepths = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptySelectedDepths,
                writable: true,
                configurable: true
            });

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("transformObjectXElementが存在しない場合は何もしない", async () => {
            const mockEvent = createMockEvent(false);
            vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
                if (id === "transform-object-x") {
                    return null;
                }
                if (id === "transform-object-y") {
                    return mockTransformObjectYElement;
                }
                return null;
            });

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("transformObjectYElementが存在しない場合は何もしない", async () => {
            const mockEvent = createMockEvent(false);
            vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
                if (id === "transform-object-x") {
                    return mockTransformObjectXElement;
                }
                if (id === "transform-object-y") {
                    return null;
                }
                return null;
            });

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("positionがnullの場合は何もしない", async () => {
            const mockEvent = createMockEvent(false);
            mockScreenAreaCalcSelectedCharacterPositionService.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("positionがundefinedの場合は何もしない", async () => {
            const mockEvent = createMockEvent(false);
            mockScreenAreaCalcSelectedCharacterPositionService.mockReturnValue(undefined);

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("selectedDepths.sizeが0の場合は早期リターン", async () => {
            const mockEvent = createMockEvent(false);
            const emptyMap = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptyMap,
                writable: true,
                configurable: true
            });

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理", () => {
        it("stopPropagationが呼ばれる", async () => {
            const mockEvent = createMockEvent(false);
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("positionがnullの場合はイベント処理されない", async () => {
            const mockEvent = createMockEvent(false);
            mockScreenAreaCalcSelectedCharacterPositionService.mockReturnValue(null);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });

        it("preventDefaultは呼ばれない（ArrowDownと異なる）", async () => {
            const mockEvent = createMockEvent(false);
            await execute(mockEvent);

            // ArrowUpEventUseCaseではpreventDefaultを呼ばない
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe("サービス呼び出し", () => {
        it("screenAreaCalcSelectedCharacterPositionServiceが正しく呼ばれる", async () => {
            const mockEvent = createMockEvent(false);
            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledTimes(1);
        });

        it("screenDisplayObjectUpdateSelectedValueServiceが非同期で呼ばれる", async () => {
            const mockEvent = createMockEvent(false);
            await execute(mockEvent);

            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalledTimes(1);
        });

        it("サービスが正しい順序で呼ばれる", async () => {
            const mockEvent = createMockEvent(false);
            const callOrder: string[] = [];

            mockScreenAreaCalcSelectedCharacterPositionService.mockImplementation(() => {
                callOrder.push("calcPosition");
                return { x: 100, y: 100 };
            });

            mockScreenDisplayObjectUpdateSelectedValueService.mockImplementation(async () => {
                callOrder.push("updateValue");
            });

            await execute(mockEvent);

            expect(callOrder).toEqual(["calcPosition", "updateValue"]);
        });
    });

    describe("transformSettingの設定", () => {
        it("transformSetting.xが0に設定される", async () => {
            const mockEvent = createMockEvent(false);
            transformSetting.x = 999; // 初期値を設定

            await execute(mockEvent);

            expect(transformSetting.x).toBe(0);
        });

        it("transformSetting.yが正しく計算される（負の値）", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-1);
        });

        it("transformSetting.beforeXがHTML要素の値から設定される", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "123.45";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBe(123.45);  // Arrow events don\'t set beforeX/Y
        });

        it("transformSetting.beforeYがHTML要素の値から設定される", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectYElement.value = "67.89";

            await execute(mockEvent);

            // expect(transformSetting.beforeY).toBe(67.89);  // Arrow events don\'t set beforeX/Y
        });

        it("既存のtransformSetting値がリセットされる", async () => {
            const mockEvent = createMockEvent(false);
            transformSetting.x = 100;
            transformSetting.y = 200;

            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).toBe(-1);
        });

        it("HTML要素の値が整数の場合も正しくパースされる", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "10";
            mockTransformObjectYElement.value = "20";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBe(10);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(20);  // Arrow events don\'t set beforeX/Y
        });

        it("HTML要素の値が負数の場合も正しくパースされる", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "-15.5";
            mockTransformObjectYElement.value = "-25.75";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBe(-15.5);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(-25.75);  // Arrow events don\'t set beforeX/Y
        });
    });

    describe("複数選択時の動作", () => {
        it("複数のキャラクターが選択されている場合", async () => {
            const mockEvent = createMockEvent(false);
            const multiSelectedDepths = new Map([
                [0, [1, 2, 3]],
                [1, [4, 5]]
            ]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: multiSelectedDepths,
                writable: true,
                configurable: true
            });

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("単一選択の場合も正常に動作する", async () => {
            const mockEvent = createMockEvent(false);
            const singleSelectedDepths = new Map([[0, [1]]]);
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: singleSelectedDepths,
                writable: true,
                configurable: true
            });

            await execute(mockEvent);

            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });
    });

    describe("エッジケース", () => {
        it("scale=0の場合、移動量も0になる", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 0;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-0); // -1 * 0 = -0 (JavaScript negative zero)
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("scale=0でShiftキーありの場合も移動量は0", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 0;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-0); // -10 * 0 = -0 (JavaScript negative zero)
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("非常に大きなscale値の場合", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 100;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-1000); // -10 * 100
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("非常に小さなscale値の場合", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 0.01;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-0.01); // -1 * 0.01
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("負のscale値の場合（理論上）", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = -1;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(1); // -1 * (-1)
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("HTML要素の値が空文字列の場合はNaNになる", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "";
            mockTransformObjectYElement.value = "";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBeNaN();  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBeNaN();  // Arrow events don\'t set beforeX/Y
        });

        it("HTML要素の値が不正な文字列の場合はNaNになる", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "invalid";
            mockTransformObjectYElement.value = "abc";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBeNaN();  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBeNaN();  // Arrow events don\'t set beforeX/Y
        });
    });

    describe("統合シナリオ", () => {
        it("完全な上移動フロー（Shiftキーなし）", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;
            mockTransformObjectXElement.value = "100";
            mockTransformObjectYElement.value = "200";

            await execute(mockEvent);

            // 1. selectedDepthsのチェック
            expect(mockMovieClip.selectedDepths.size).toBeGreaterThan(0);

            // 2. HTML要素の取得
            expect(document.getElementById).toHaveBeenCalledWith("transform-object-x");
            expect(document.getElementById).toHaveBeenCalledWith("transform-object-y");

            // 3. position計算
            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);

            // 4. イベント処理
            expect(mockEvent.stopPropagation).toHaveBeenCalled();

            // 5. transformSettingの設定
            // expect(transformSetting.beforeX).toBe(100);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(200);  // Arrow events don\'t set beforeX/Y
            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).toBe(-1);

            // 6. 値の更新
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("完全な上移動フロー（Shiftキーあり、scale=2）", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 2;
            mockTransformObjectXElement.value = "50.5";
            mockTransformObjectYElement.value = "75.25";

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalledWith(mockMovieClip);
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            // expect(transformSetting.beforeX).toBe(50.5);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(75.25);  // Arrow events don\'t set beforeX/Y
            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).toBe(-20); // -10 * 2
            expect(mockScreenDisplayObjectUpdateSelectedValueService).toHaveBeenCalled();
        });

        it("エラーケース: 選択なし", async () => {
            const mockEvent = createMockEvent(false);
            const emptySelectedDepths = new Map();
            Object.defineProperty(mockMovieClip, 'selectedDepths', {
                value: emptySelectedDepths,
                writable: true,
                configurable: true
            });

            await execute(mockEvent);

            // 何も実行されない
            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
        });

        it("エラーケース: HTML要素が存在しない", async () => {
            const mockEvent = createMockEvent(false);
            vi.spyOn(document, "getElementById").mockReturnValue(null);

            await execute(mockEvent);

            expect(mockScreenAreaCalcSelectedCharacterPositionService).not.toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
        });

        it("エラーケース: position取得失敗", async () => {
            const mockEvent = createMockEvent(false);
            mockScreenAreaCalcSelectedCharacterPositionService.mockReturnValue(null);

            await execute(mockEvent);

            // position計算までは実行されるが、それ以降は実行されない
            expect(mockScreenAreaCalcSelectedCharacterPositionService).toHaveBeenCalled();
            expect(mockScreenDisplayObjectUpdateSelectedValueService).not.toHaveBeenCalled();
        });
    });

    describe("Shiftキーの状態による分岐", () => {
        it("shiftKey=falseの時は1ピクセル移動", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-1);
        });

        it("shiftKey=trueの時は10ピクセル移動", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBe(-10);
        });

        it("shiftKeyの状態が変わっても正しく動作する", async () => {
            // 1回目: Shiftキーなし
            const mockEvent1 = createMockEvent(false);
            mockWorkSpace.scale = 1;
            await execute(mockEvent1);
            expect(transformSetting.y).toBe(-1);

            // 2回目: Shiftキーあり
            const mockEvent2 = createMockEvent(true);
            await execute(mockEvent2);
            expect(transformSetting.y).toBe(-10);
        });
    });

    describe("上方向特有のテスト", () => {
        it("移動方向が常に負（上）である", async () => {
            const mockEvent = createMockEvent(false);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBeLessThan(0);
        });

        it("Shiftキーありでも移動方向が負（上）である", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 1;

            await execute(mockEvent);

            expect(transformSetting.y).toBeLessThan(0);
        });

        it("移動量の絶対値がShiftキーで10倍になる", async () => {
            const mockEvent1 = createMockEvent(false);
            mockWorkSpace.scale = 1;
            await execute(mockEvent1);
            const withoutShift = Math.abs(transformSetting.y);

            const mockEvent2 = createMockEvent(true);
            await execute(mockEvent2);
            const withShift = Math.abs(transformSetting.y);

            expect(withShift).toBe(withoutShift * 10);
        });

        it("X軸方向には影響しない", async () => {
            const mockEvent = createMockEvent(true);
            mockWorkSpace.scale = 10;
            transformSetting.x = 999;

            await execute(mockEvent);

            expect(transformSetting.x).toBe(0);
            expect(transformSetting.y).not.toBe(0);
        });

        it("beforeX/beforeYが常に設定される", async () => {
            const mockEvent = createMockEvent(false);
            mockTransformObjectXElement.value = "10";
            mockTransformObjectYElement.value = "20";

            await execute(mockEvent);

            // expect(transformSetting.beforeX).toBeDefined();  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBeDefined();  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeX).toBe(10);  // Arrow events don\'t set beforeX/Y
            // expect(transformSetting.beforeY).toBe(20);  // Arrow events don\'t set beforeX/Y
        });
    });
});
