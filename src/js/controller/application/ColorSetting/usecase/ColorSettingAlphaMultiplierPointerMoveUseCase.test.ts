import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// モック関数の定義
const mock$getColorSettingState = vi.fn();
const mock$getCurrentWorkSpace = vi.fn();
const mockColorSettingAlphaMultiplierUpdateElementUseCase = vi.fn();
const mock$clamp = vi.fn();
const mock$setCursor = vi.fn();

// vi.mockの呼び出し
vi.mock("../ColorSettingUtil", () => ({
    $getColorSettingState: () => mock$getColorSettingState()
}));

vi.mock("@/core/application/CoreUtil", () => ({
    $getCurrentWorkSpace: () => mock$getCurrentWorkSpace()
}));

vi.mock("./ColorSettingAlphaMultiplierUpdateElementUseCase", () => ({
    execute: (movieClip: any, value: number) => mockColorSettingAlphaMultiplierUpdateElementUseCase(movieClip, value)
}));

vi.mock("@/global/GlobalUtil", () => ({
    $clamp: (value: number, min: number, max: number) => mock$clamp(value, min, max),
    $setCursor: (cursor: string) => mock$setCursor(cursor)
}));

// 動的インポート
const { execute } = await import("./ColorSettingAlphaMultiplierPointerMoveUseCase");

describe("ColorSettingAlphaMultiplierPointerMoveUseCase", () => {
    let mockElement: HTMLInputElement;
    let rafCallback: (() => void) | null = null;
    let mockMovieClip: any;
    let mockWorkSpace: any;

    const createMockEvent = (
        movementX: number = 5,
        target: HTMLInputElement | null = null
    ): PointerEvent => {
        return {
            movementX: movementX,
            target: target,
            stopPropagation: vi.fn(),
            preventDefault: vi.fn()
        } as unknown as PointerEvent;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // モックHTML要素を作成
        mockElement = document.createElement("input");
        mockElement.type = "range";
        mockElement.value = "50";

        // モックMovieClipとWorkSpaceを作成
        mockMovieClip = {
            selectedDepths: new Map([[0, [1]]])
        };
        mockWorkSpace = {
            scene: mockMovieClip
        };

        // デフォルトでは"down"状態
        mock$getColorSettingState.mockReturnValue("down");

        // $getCurrentWorkSpaceのモック
        mock$getCurrentWorkSpace.mockReturnValue(mockWorkSpace);

        // $clampのデフォルト実装
        mock$clamp.mockImplementation((value: number, min: number, max: number) => {
            return Math.min(Math.max(value, min), max);
        });

        // requestAnimationFrameのモック
        rafCallback = null;
        global.requestAnimationFrame = vi.fn((callback: () => void) => {
            rafCallback = callback;
            return 1;
        }) as any;
    });

    afterEach(() => {
        rafCallback = null;
    });

    describe("基本動作", () => {
        it("カーソルがew-resizeに設定される", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
        });

        it("movementXが0でない場合、処理が実行される", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(global.requestAnimationFrame).toHaveBeenCalled();
        });

        it("requestAnimationFrameが呼ばれる", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
        });

        it("要素のvalueが更新される", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("60");
        });

        it("colorSettingAlphaMultiplierUpdateElementUseCaseが呼ばれる", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).toHaveBeenCalledWith(mockMovieClip, 60);
        });
    });

    describe("早期リターン条件", () => {
        it("movementXが0の場合は早期リターン", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(global.requestAnimationFrame).not.toHaveBeenCalled();
        });

        it("movementXがundefinedの場合も処理される（falsyチェック）", async () => {
            const mockEvent = createMockEvent(undefined as any, mockElement);

            await execute(mockEvent);

            // undefinedは falsy だが、実装では !event.movementX でチェック
            // undefinedは0と異なり、型変換されるため処理される可能性がある
            expect(mock$setCursor).toHaveBeenCalled();
            // 実装の動作に基づき、undefinedでも処理が続行される
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
        });

        it("colorSettingStateが'up'の場合は何もしない", async () => {
            mock$getColorSettingState.mockReturnValue("up");
            mockElement.value = "50";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).not.toHaveBeenCalled();
            expect(mockElement.value).toBe("50"); // 変更されない
        });

        it("event.targetがnullの場合は何もしない", async () => {
            const mockEvent = createMockEvent(5, null);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).not.toHaveBeenCalled();
        });

        it("event.targetがundefinedの場合は何もしない", async () => {
            const mockEvent = {
                movementX: 5,
                target: undefined,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn()
            } as unknown as PointerEvent;

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).not.toHaveBeenCalled();
        });
    });

    describe("イベント処理", () => {
        it("stopPropagationが呼ばれる", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        });

        it("preventDefaultが呼ばれる", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        });

        it("movementXが0の場合はstopPropagationが呼ばれない", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("値の計算", () => {
        it("正のmovementXで値が増加する", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(60, 0, 100);
            expect(mockElement.value).toBe("60");
        });

        it("負のmovementXで値が減少する", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(-10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(40, 0, 100);
            expect(mockElement.value).toBe("40");
        });

        it("$clampが0から100の範囲でクランプする", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(55, 0, 100);
        });

        it("100を超える値が100にクランプされる", async () => {
            mockElement.value = "95";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(105, 0, 100);
            expect(mockElement.value).toBe("100"); // clampの実装により100になる
        });

        it("0未満の値が0にクランプされる", async () => {
            mockElement.value = "5";
            const mockEvent = createMockEvent(-10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(-5, 0, 100);
            expect(mockElement.value).toBe("0"); // clampの実装により0になる
        });
    });

    describe("様々なmovementX値", () => {
        it("movementX = 1の場合", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(1, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("51");
        });

        it("movementX = -1の場合", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(-1, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("49");
        });

        it("movementX = 50の場合", async () => {
            mockElement.value = "30";
            const mockEvent = createMockEvent(50, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("80");
        });

        it("movementX = -50の場合", async () => {
            mockElement.value = "70";
            const mockEvent = createMockEvent(-50, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("20");
        });
    });

    describe("境界値テスト", () => {
        it("初期値0からmovementX=5で5になる", async () => {
            mockElement.value = "0";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("5");
        });

        it("初期値100からmovementX=-5で95になる", async () => {
            mockElement.value = "100";
            const mockEvent = createMockEvent(-5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("95");
        });

        it("初期値0からmovementX=-5で0のまま", async () => {
            mockElement.value = "0";
            const mockEvent = createMockEvent(-5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("0");
        });

        it("初期値100からmovementX=5で100のまま", async () => {
            mockElement.value = "100";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("100");
        });
    });

    describe("カーソル設定", () => {
        it("常にew-resizeカーソルが設定される", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
        });

        it("movementXが0でもカーソルは設定される", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");
        });

        it("$setCursorが最初に呼ばれる", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalledBefore(mockEvent.stopPropagation as any);
        });
    });

    describe("requestAnimationFrame内の処理", () => {
        it("rafコールバック内でcolorSettingStateがチェックされる", async () => {
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            expect(mock$getColorSettingState).not.toHaveBeenCalled();

            if (rafCallback) await rafCallback();
            expect(mock$getColorSettingState).toHaveBeenCalled();
        });

        it("rafコールバックが非同期で実行される", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            
            // rafCallback実行前は更新されない
            expect(mockElement.value).toBe("50");

            if (rafCallback) await rafCallback();
            
            // rafCallback実行後は更新される
            expect(mockElement.value).toBe("60");
        });
    });

    describe("統合シナリオ", () => {
        it("完全なポインタームーブフロー", async () => {
            mockElement.value = "45";
            const mockEvent = createMockEvent(15, mockElement);

            await execute(mockEvent);

            // 1. カーソル設定
            expect(mock$setCursor).toHaveBeenCalledWith("ew-resize");

            // 2. movementXチェック
            expect(mockEvent.movementX).toBe(15);

            // 3. イベント処理
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();

            // 4. requestAnimationFrame
            expect(global.requestAnimationFrame).toHaveBeenCalled();

            if (rafCallback) await rafCallback();

            // 5. colorSettingStateチェック
            expect(mock$getColorSettingState).toHaveBeenCalled();

            // 6. 値の計算と更新
            expect(mock$clamp).toHaveBeenCalledWith(60, 0, 100);
            expect(mockElement.value).toBe("60");

            // 7. updateElementUseCase呼び出し
            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).toHaveBeenCalledWith(mockMovieClip, 60);
        });

        it("エラーケース: movementX = 0で早期リターン", async () => {
            const mockEvent = createMockEvent(0, mockElement);

            await execute(mockEvent);

            expect(mock$setCursor).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(global.requestAnimationFrame).not.toHaveBeenCalled();
        });

        it("エラーケース: colorSettingState = 'up'でraf内で早期リターン", async () => {
            mock$getColorSettingState.mockReturnValue("up");
            mockElement.value = "50";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mockElement.value).toBe("50");
            expect(mockColorSettingAlphaMultiplierUpdateElementUseCase).not.toHaveBeenCalled();
        });
    });

    describe("parseFloatの動作", () => {
        it("小数点を含む値が正しくパースされる", async () => {
            mockElement.value = "50.5";
            const mockEvent = createMockEvent(5, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(55.5, 0, 100);
        });

        it("文字列の数値が正しくパースされる", async () => {
            mockElement.value = "25";
            const mockEvent = createMockEvent(10, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(35, 0, 100);
        });
    });

    describe("複数回の移動", () => {
        it("連続したムーブイベントが正しく処理される", async () => {
            mockElement.value = "50";

            // 1回目
            const mockEvent1 = createMockEvent(5, mockElement);
            await execute(mockEvent1);
            if (rafCallback) await rafCallback();
            expect(mockElement.value).toBe("55");

            // 2回目
            const mockEvent2 = createMockEvent(10, mockElement);
            await execute(mockEvent2);
            if (rafCallback) await rafCallback();
            expect(mockElement.value).toBe("65");

            // 3回目
            const mockEvent3 = createMockEvent(-20, mockElement);
            await execute(mockEvent3);
            if (rafCallback) await rafCallback();
            expect(mockElement.value).toBe("45");
        });
    });

    describe("エッジケース", () => {
        it("movementXが非常に大きい値の場合", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(1000, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(1050, 0, 100);
            expect(mockElement.value).toBe("100");
        });

        it("movementXが非常に小さい値の場合", async () => {
            mockElement.value = "50";
            const mockEvent = createMockEvent(-1000, mockElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            expect(mock$clamp).toHaveBeenCalledWith(-950, 0, 100);
            expect(mockElement.value).toBe("0");
        });

        it("要素のvalueが初期状態で空文字列の場合", async () => {
            // 新しい要素を作成して空文字列を設定
            const emptyElement = document.createElement("input");
            emptyElement.type = "range";
            emptyElement.value = "";
            
            const mockEvent = createMockEvent(50, emptyElement);

            await execute(mockEvent);
            if (rafCallback) await rafCallback();

            // HTMLInputElement[type="range"]は空文字列を設定しても
            // ブラウザ(およびjsdom)が自動的にデフォルト値に正規化する
            // そのため、実際には有効な数値が入っている
            expect(mock$clamp).toHaveBeenCalled();
            const clampArgs = mock$clamp.mock.calls[0];
            // 正規化された値に50が加算される
            expect(typeof clampArgs[0]).toBe("number");
            expect(clampArgs[1]).toBe(0);
            expect(clampArgs[2]).toBe(100);
            // 最終的な値は有効な数値になる
            expect(emptyElement.value).not.toBe("");
        });
    });
});
