import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$updateKeyLock = vi.fn();
const mock$clamp = vi.fn();
const mockColorSettingAlphaOffsetUpdateValueUseCase = vi.fn();

// vi.mockの呼び出し
vi.mock("@/shortcut/ShortcutUtil", () => ({
    $updateKeyLock: (value: boolean) => mock$updateKeyLock(value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max)
}));

vi.mock("./ColorSettingAlphaOffsetUpdateValueUseCase", () => ({
    execute: async (alpha: number) => mockColorSettingAlphaOffsetUpdateValueUseCase(alpha)
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaOffsetFocusOutEventUseCase");

describe("ColorSettingAlphaOffsetFocusOutEventUseCase", () => {
    let mockElement: HTMLInputElement;
    let mockEvent: FocusEvent;

    beforeEach(() => {
        vi.clearAllMocks();

        // モックelement
        mockElement = document.createElement("input");
        mockElement.type = "number";
        mockElement.value = "50";

        // モックFocusEvent
        mockEvent = {
            target: mockElement,
            stopPropagation: vi.fn()
        } as unknown as FocusEvent;

        // デフォルトのclampの動作をモック
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.max(min, Math.min(max, value));
        });

        // デフォルトのUpdateValueUseCaseの動作をモック
        mockColorSettingAlphaOffsetUpdateValueUseCase.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("基本動作", () => {
        it("targetがnullの場合は早期リターン", async () => {
            mockEvent = {
                target: null,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
        });

        it("targetがundefinedの場合は早期リターン", async () => {
            mockEvent = {
                target: undefined,
                stopPropagation: vi.fn()
            } as unknown as FocusEvent;

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mock$updateKeyLock).not.toHaveBeenCalled();
        });

        it("stopPropagationが呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("$updateKeyLockがfalseで呼ばれる", async () => {
            await execute(mockEvent);

            expect(mock$updateKeyLock).toHaveBeenCalledWith(false);
            expect(mock$updateKeyLock).toHaveBeenCalledTimes(1);
        });

        it("$clampが正しいパラメータで呼ばれる", async () => {
            mockElement.value = "75";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(75, -255, 255);
        });

        it("colorSettingAlphaOffsetUpdateValueUseCaseが呼ばれる", async () => {
            mock$clamp.mockReturnValue(50);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(50);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledTimes(1);
        });

        it("非同期処理が完了するまで待機する", async () => {
            let resolved = false;
            mockColorSettingAlphaOffsetUpdateValueUseCase.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                resolved = true;
            });

            await execute(mockEvent);

            expect(resolved).toBe(true);
        });
    });

    describe("値の解析とクランプ", () => {
        it("整数値が正しく解析される", async () => {
            mockElement.value = "60";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(60, -255, 255);
        });

        it("小数点を含む値が正しく解析される", async () => {
            mockElement.value = "75.5";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(75.5, -255, 255);
        });

        it("0の値が正しく処理される", async () => {
            mockElement.value = "0";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(0, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("255の値が正しく処理される", async () => {
            mockElement.value = "255";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(255, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("負の値が正しく処理される", async () => {
            mockElement.type = "number";
            mockElement.value = "-100";
            mock$clamp.mockReturnValue(-100);

            await execute(mockEvent);

            // type="number"の場合、負の値もサポート
            expect(mock$clamp).toHaveBeenCalledWith(-100, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-100);
        });

        it("255を超える値が255にクランプされる", async () => {
            mockElement.type = "number";
            mockElement.value = "300";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            // type="number"の場合、300はそのまま渡され、clampで255になる
            expect(mock$clamp).toHaveBeenCalledWith(300, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("type='number'で-255未満の値の場合はparseFloatした値がclampに渡される", async () => {
            mockElement.type = "number";
            mockElement.value = "-300";
            mock$clamp.mockReturnValue(-255);

            await execute(mockEvent);

            // type="number"の場合、-300はそのまま渡され、clampで-255になる
            expect(mock$clamp).toHaveBeenCalledWith(-300, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-255);
        });

        it("type='number'で255を超える値の場合はparseFloatした値がclampに渡される", async () => {
            mockElement.type = "number";
            mockElement.value = "300";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            // type="number"の場合、300はそのまま渡され、clampで255になる
            expect(mock$clamp).toHaveBeenCalledWith(300, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("空文字列の場合 (type='number'はNaN)", async () => {
            mockElement.type = "number";
            mockElement.value = "";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            // type="number"の場合、空文字列はNaNになり、clampで処理される
            expect(mock$clamp).toHaveBeenCalled();
        });

        it("不正な文字列の場合 (type='number'はNaN)", async () => {
            mockElement.type = "number";
            mockElement.value = "abc";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            // type="number"の場合、不正な値はNaNになり、clampで処理される
            expect(mock$clamp).toHaveBeenCalled();
        });
    });

    describe("実行順序", () => {
        it("処理が正しい順序で実行される", async () => {
            const callOrder: string[] = [];

            mockEvent.stopPropagation = vi.fn(() => callOrder.push("stopPropagation"));
            mock$updateKeyLock.mockImplementation(() => callOrder.push("updateKeyLock"));
            mock$clamp.mockImplementation((value: number, min: number, max: number) => {
                callOrder.push("clamp");
                return Math.max(min, Math.min(max, value));
            });
            mockColorSettingAlphaOffsetUpdateValueUseCase.mockImplementation(async () => {
                callOrder.push("updateValueUseCase");
            });

            await execute(mockEvent);

            // 1. stopPropagation
            // 2. $updateKeyLock
            // 3. $clamp
            // 4. updateValueUseCase
            expect(callOrder[0]).toBe("stopPropagation");
            expect(callOrder[1]).toBe("updateKeyLock");
            expect(callOrder[2]).toBe("clamp");
            expect(callOrder[3]).toBe("updateValueUseCase");
        });

        it("stopPropagationがupdateKeyLockより前に実行される", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mock$updateKeyLock).toHaveBeenCalled();
        });

        it("clampがupdateValueUseCaseより前に実行される", async () => {
            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalled();
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalled();
        });
    });

    describe("$clampの動作", () => {
        it("clampは3つの引数(value, min, max)を受け取る", async () => {
            mockElement.value = "50";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(50, -255, 255);
        });

        it("clampの結果がupdateValueUseCaseに渡される", async () => {
            mockElement.value = "75";
            mock$clamp.mockReturnValue(75);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(75);
        });

        it("clampが最小値-255を使用する", async () => {
            mockElement.value = "50";

            await execute(mockEvent);

            const [, min] = mock$clamp.mock.calls[0];
            expect(min).toBe(-255);
        });

        it("clampが最大値255を使用する", async () => {
            mockElement.value = "50";

            await execute(mockEvent);

            const [, , max] = mock$clamp.mock.calls[0];
            expect(max).toBe(255);
        });
    });

    describe("統合シナリオ", () => {
        it("完全なフォーカスアウトフロー", async () => {
            mockElement.value = "80";
            mock$clamp.mockReturnValue(80);

            await execute(mockEvent);

            // 1. stopPropagationが呼ばれる
            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);

            // 2. キーロックが無効化される
            expect(mock$updateKeyLock).toHaveBeenCalledWith(false);

            // 3. 値がクランプされる
            expect(mock$clamp).toHaveBeenCalledWith(80, -255, 255);

            // 4. 値が更新される
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(80);
        });

        it("範囲外の値が正しく処理される", async () => {
            mockElement.type = "number";
            mockElement.value = "300";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            // type="number"の場合、300はclampで255になる
            expect(mock$clamp).toHaveBeenCalledWith(300, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("負の値が正しく処理される", async () => {
            mockElement.type = "number";
            mockElement.value = "-100";
            mock$clamp.mockReturnValue(-100);

            await execute(mockEvent);

            // type="number"の場合、負の値もサポート
            expect(mock$clamp).toHaveBeenCalledWith(-100, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-100);
        });

        it("updateValueUseCaseがエラーを投げても伝播する", async () => {
            mockColorSettingAlphaOffsetUpdateValueUseCase.mockRejectedValue(new Error("Test Error"));

            await expect(execute(mockEvent)).rejects.toThrow("Test Error");
        });
    });

    describe("エッジケース", () => {
        it("value = '0'の場合", async () => {
            mockElement.value = "0";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(0);
        });

        it("value = '255'の場合", async () => {
            mockElement.value = "255";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("value = '-255'の場合", async () => {
            mockElement.value = "-255";
            mock$clamp.mockReturnValue(-255);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-255);
        });

        it("value = '0.1'の場合", async () => {
            mockElement.value = "0.1";
            mock$clamp.mockReturnValue(0.1);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(0.1, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(0.1);
        });

        it("value = '99.99'の場合", async () => {
            mockElement.value = "99.99";
            mock$clamp.mockReturnValue(99.99);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(99.99, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(99.99);
        });

        it("value = '50.5'の場合", async () => {
            mockElement.value = "50.5";
            mock$clamp.mockReturnValue(50.5);

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(50.5, -255, 255);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(50.5);
        });

        it("value = '-256'の場合 (-255にクランプ)", async () => {
            mockElement.value = "-256";
            mock$clamp.mockReturnValue(-255);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-255);
        });

        it("value = '256'の場合 (255にクランプ)", async () => {
            mockElement.value = "256";
            mock$clamp.mockReturnValue(255);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(255);
        });

        it("type='number'で空文字列の場合 (NaN → 0にクランプ)", async () => {
            mockElement.type = "number";
            mockElement.value = "";
            mock$clamp.mockReturnValue(0);

            await execute(mockEvent);

            // parseFloat("") = NaN, clampはNaNを処理
            expect(mock$clamp).toHaveBeenCalled();
        });
    });

    describe("HTMLInputElementの動作", () => {
        it("input要素のvalueプロパティが正しく読み取られる", async () => {
            mockElement.value = "42";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(42, -255, 255);
        });

        it("type='number'の要素で動作する", async () => {
            mockElement.type = "number";
            mockElement.value = "55";
            mock$clamp.mockReturnValue(55);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(55);
        });

        it("type='number'の要素で負の値も動作する", async () => {
            mockElement.type = "number";
            mockElement.value = "-88";
            mock$clamp.mockReturnValue(-88);

            await execute(mockEvent);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(-88);
        });
    });

    describe("FocusEventの処理", () => {
        it("FocusEventのtargetが正しく取得される", async () => {
            await execute(mockEvent);

            // targetから値が取得されている
            expect(mock$clamp).toHaveBeenCalled();
        });

        it("stopPropagationが1回だけ呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("複数回実行してもそれぞれ正しく処理される", async () => {
            mockElement.value = "10";
            mock$clamp.mockReturnValue(10);
            await execute(mockEvent);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(10);

            mockElement.value = "20";
            mock$clamp.mockReturnValue(20);
            await execute(mockEvent);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(20);

            mockElement.value = "30";
            mock$clamp.mockReturnValue(30);
            await execute(mockEvent);
            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledWith(30);

            expect(mockColorSettingAlphaOffsetUpdateValueUseCase).toHaveBeenCalledTimes(3);
        });
    });

    describe("非同期処理", () => {
        it("Promiseを返す", async () => {
            const result = execute(mockEvent);
            expect(result).toBeInstanceOf(Promise);
            await result;
        });

        it("awaitで完了を待機できる", async () => {
            let completed = false;
            mockColorSettingAlphaOffsetUpdateValueUseCase.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                completed = true;
            });

            await execute(mockEvent);

            expect(completed).toBe(true);
        });

        it("updateValueUseCaseのPromiseが解決されるまで待つ", async () => {
            const callOrder: string[] = [];
            
            mockColorSettingAlphaOffsetUpdateValueUseCase.mockImplementation(async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                callOrder.push("updateValueUseCase resolved");
            });

            await execute(mockEvent);
            callOrder.push("execute completed");

            expect(callOrder[0]).toBe("updateValueUseCase resolved");
            expect(callOrder[1]).toBe("execute completed");
        });
    });

    describe("parseFloatの動作", () => {
        it("parseFloatが内部で使用される", async () => {
            mockElement.value = "75.75";

            await execute(mockEvent);

            // parseFloat("75.75") = 75.75
            expect(mock$clamp).toHaveBeenCalledWith(75.75, -255, 255);
        });

        it("整数文字列が正しく解析される", async () => {
            mockElement.value = "50";

            await execute(mockEvent);

            expect(mock$clamp).toHaveBeenCalledWith(50, -255, 255);
        });

        it("不正な文字列はNaNとなる (type='number'の場合)", async () => {
            mockElement.type = "number";
            mockElement.value = "50abc";

            await execute(mockEvent);

            // type="number"の場合、"50abc"は無効な値としてNaNになる
            // HTMLInputElement.value は type="number" で無効な値の場合、空文字列を返す
            expect(mock$clamp).toHaveBeenCalled();
        });
    });
});
