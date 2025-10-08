import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// モック設定（vi.hoistedを使用）
const {
    mockAllHideMenu,
    mockSetEditingElement,
    mockTimelineToolPlayStopUseCase,
    mockActiveTouchPointers
} = vi.hoisted(() => {
    return {
        mockAllHideMenu: vi.fn(),
        mockSetEditingElement: vi.fn(),
        mockTimelineToolPlayStopUseCase: vi.fn(),
        mockActiveTouchPointers: new Map()
    };
});

vi.mock("@/menu/application/MenuUtil", () => ({
    $allHideMenu: mockAllHideMenu
}));

vi.mock("@/global/GlobalUtil", () => ({
    $activeTouchPointers: mockActiveTouchPointers,
    $setEditingElement: mockSetEditingElement
}));

vi.mock("./TimelineToolPlayStopUseCase", () => ({
    execute: mockTimelineToolPlayStopUseCase
}));

import { execute } from "./TimelineToolPlayStopPointerDownEventUseCase";

describe("TimelineToolPlayStopPointerDownEventUseCase", () => {
    let mockEvent: PointerEvent;

    beforeEach(() => {
        vi.clearAllMocks();
        mockActiveTouchPointers.clear();

        // PointerEvent モック
        mockEvent = {
            button: 0,
            stopPropagation: vi.fn()
        } as any;

        // 関数モック設定
        mockTimelineToolPlayStopUseCase.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.resetAllMocks();
        mockActiveTouchPointers.clear();
    });

    describe("正常系", () => {
        it("左クリック（button=0）で再生・停止処理を実行する", async () => {
            await execute(mockEvent);

            // メニュー非表示の確認
            expect(mockAllHideMenu).toHaveBeenCalledOnce();

            // 編集中要素のリセット確認
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);

            // イベント伝播の停止確認
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();

            // 再生・停止UseCase実行確認
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
        });

        it("タッチポインターが1つの場合は正常に処理される", async () => {
            mockActiveTouchPointers.set("pointer1", {});

            await execute(mockEvent);

            expect(mockAllHideMenu).toHaveBeenCalledOnce();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
        });

        it("タッチポインターが0個の場合は正常に処理される", async () => {
            // mockActiveTouchPointers は空のまま

            await execute(mockEvent);

            expect(mockAllHideMenu).toHaveBeenCalledOnce();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
        });

        it("複数回の連続実行でも正常に動作する", async () => {
            // 1回目
            await execute(mockEvent);

            // 2回目
            await execute(mockEvent);

            // 3回目
            await execute(mockEvent);

            // 各関数が3回ずつ呼ばれることを確認
            expect(mockAllHideMenu).toHaveBeenCalledTimes(3);
            expect(mockSetEditingElement).toHaveBeenCalledTimes(3);
            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(3);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(3);
        });
    });

    describe("早期リターン条件", () => {
        it("右クリック（button=2）の場合は処理を実行しない", async () => {
            const rightClickEvent = {
                button: 2,
                stopPropagation: vi.fn()
            } as any;

            await execute(rightClickEvent);

            // 何も実行されていないことを確認
            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(rightClickEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("中クリック（button=1）の場合は処理を実行しない", async () => {
            const middleClickEvent = {
                button: 1,
                stopPropagation: vi.fn()
            } as any;

            await execute(middleClickEvent);

            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(middleClickEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("アクティブタッチポインターが2つ以上の場合は処理を実行しない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(mockEvent);

            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("タッチポインターがちょうど2個の場合は処理されない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(mockEvent);

            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        it("タッチポインターが3個以上の場合は処理されない", async () => {
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});
            mockActiveTouchPointers.set("pointer3", {});

            await execute(mockEvent);

            expect(mockAllHideMenu).not.toHaveBeenCalled();
        });

        it("buttonが0でないかつタッチポインターが複数の場合", async () => {
            const invalidEvent = {
                button: 2,
                stopPropagation: vi.fn()
            } as any;
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(invalidEvent);

            expect(mockAllHideMenu).not.toHaveBeenCalled();
            expect(invalidEvent.stopPropagation).not.toHaveBeenCalled();
        });
    });

    describe("処理順序の確認", () => {
        it("処理が正しい順序で実行される", async () => {
            const executionOrder: string[] = [];

            mockAllHideMenu.mockImplementation(() => {
                executionOrder.push("allHideMenu");
            });

            mockSetEditingElement.mockImplementation(() => {
                executionOrder.push("setEditingElement");
            });

            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                executionOrder.push("stopPropagation");
            });

            mockTimelineToolPlayStopUseCase.mockImplementation(async () => {
                executionOrder.push("timelineToolPlayStopUseCase");
            });

            await execute(mockEvent);

            expect(executionOrder).toEqual([
                "allHideMenu",
                "setEditingElement",
                "stopPropagation",
                "timelineToolPlayStopUseCase"
            ]);
        });
    });

    describe("依存関係の確認", () => {
        it("メニューが正しく非表示にされる", async () => {
            await execute(mockEvent);

            expect(mockAllHideMenu).toHaveBeenCalledOnce();
            expect(mockAllHideMenu).toHaveBeenCalledWith();
        });

        it("編集中要素が正しくnullに設定される", async () => {
            await execute(mockEvent);

            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
        });

        it("TimelineToolPlayStopUseCaseが引数なしで呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledWith();
        });
    });

    describe("非同期処理の確認", () => {
        it("TimelineToolPlayStopUseCaseの非同期処理が完了するまで待機する", async () => {
            let useCaseResolved = false;

            mockTimelineToolPlayStopUseCase.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        useCaseResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            await execute(mockEvent);

            expect(useCaseResolved).toBe(true);
        });

        it("TimelineToolPlayStopUseCaseでエラーが発生した場合は例外が伝播する", async () => {
            const error = new Error("PlayStop UseCase failed");
            mockTimelineToolPlayStopUseCase.mockRejectedValue(error);

            await expect(execute(mockEvent)).rejects.toThrow("PlayStop UseCase failed");

            // エラー前の処理は実行されている
            expect(mockAllHideMenu).toHaveBeenCalledOnce();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();
        });

        it("並行実行されても問題なく処理される", async () => {
            const promise1 = execute(mockEvent);
            const promise2 = execute(mockEvent);
            const promise3 = execute(mockEvent);

            await Promise.all([promise1, promise2, promise3]);

            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(3);
        });
    });

    describe("エラーハンドリング", () => {
        it("allHideMenuでエラーが発生した場合", async () => {
            mockAllHideMenu.mockImplementation(() => {
                throw new Error("Menu hide failed");
            });

            await expect(execute(mockEvent)).rejects.toThrow("Menu hide failed");

            // エラー後の処理は実行されない
            expect(mockSetEditingElement).not.toHaveBeenCalled();
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("setEditingElementでエラーが発生した場合", async () => {
            mockSetEditingElement.mockImplementation(() => {
                throw new Error("Set editing element failed");
            });

            await expect(execute(mockEvent)).rejects.toThrow("Set editing element failed");

            // エラー前の処理は実行されている
            expect(mockAllHideMenu).toHaveBeenCalledOnce();

            // エラー後の処理は実行されない
            expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("stopPropagationでエラーが発生した場合", async () => {
            mockEvent.stopPropagation = vi.fn().mockImplementation(() => {
                throw new Error("Stop propagation failed");
            });

            await expect(execute(mockEvent)).rejects.toThrow("Stop propagation failed");

            // エラー前の処理は実行されている
            expect(mockAllHideMenu).toHaveBeenCalledOnce();
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);

            // エラー後の処理は実行されない
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });
    });

    describe("タッチポインター管理の詳細確認", () => {
        it("タッチポインターサイズが正確にチェックされる", async () => {
            // サイズ0（空）
            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(1);

            vi.clearAllMocks();

            // サイズ1
            mockActiveTouchPointers.set("pointer1", {});
            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(1);

            vi.clearAllMocks();

            // サイズ2（処理されない）
            mockActiveTouchPointers.set("pointer2", {});
            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("タッチポインターの追加と削除が正しく反映される", async () => {
            // ポインター追加
            mockActiveTouchPointers.set("pointer1", {});
            mockActiveTouchPointers.set("pointer2", {});

            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();

            // ポインター削除
            mockActiveTouchPointers.delete("pointer2");

            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
        });
    });

    describe("buttonパラメータの詳細確認", () => {
        const buttonTests = [
            { button: -1, shouldExecute: false, description: "負の値" },
            { button: 0, shouldExecute: true, description: "左クリック" },
            { button: 1, shouldExecute: false, description: "中クリック" },
            { button: 2, shouldExecute: false, description: "右クリック" },
            { button: 3, shouldExecute: false, description: "その他のボタン" },
            { button: 999, shouldExecute: false, description: "大きな値" }
        ];

        buttonTests.forEach(({ button, shouldExecute, description }) => {
            it(`button=${button}（${description}）の場合の動作`, async () => {
                const testEvent = {
                    button,
                    stopPropagation: vi.fn()
                } as any;

                await execute(testEvent);

                if (shouldExecute) {
                    expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
                } else {
                    expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
                }
            });
        });
    });

    describe("イベント処理の詳細確認", () => {
        it("stopPropagationが正確に1回呼ばれる", async () => {
            await execute(mockEvent);

            expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
            expect(mockEvent.stopPropagation).toHaveBeenCalledWith();
        });

        it("イベントオブジェクトの他のメソッドは呼ばれない", async () => {
            const eventWithMoreMethods = {
                button: 0,
                stopPropagation: vi.fn(),
                preventDefault: vi.fn(),
                stopImmediatePropagation: vi.fn()
            } as any;

            await execute(eventWithMoreMethods);

            expect(eventWithMoreMethods.stopPropagation).toHaveBeenCalledOnce();
            expect(eventWithMoreMethods.preventDefault).not.toHaveBeenCalled();
            expect(eventWithMoreMethods.stopImmediatePropagation).not.toHaveBeenCalled();
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：再生ボタンクリック", async () => {
            // メニューが表示されている状態を想定
            // 何かの要素が編集中の状態を想定

            await execute(mockEvent);

            // 1. メニューが非表示になる
            expect(mockAllHideMenu).toHaveBeenCalledOnce();

            // 2. 編集中要素がクリアされる
            expect(mockSetEditingElement).toHaveBeenCalledWith(null);

            // 3. イベント伝播が停止される
            expect(mockEvent.stopPropagation).toHaveBeenCalledOnce();

            // 4. 再生・停止処理が実行される
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledOnce();
        });

        it("マルチタッチ環境での使用シナリオ", async () => {
            // 最初のタッチで正常動作
            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(1);

            vi.clearAllMocks();

            // 2つ目のタッチが追加されると動作しない
            mockActiveTouchPointers.set("touch1", {});
            mockActiveTouchPointers.set("touch2", {});

            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();

            // タッチが1つに戻ると再び動作する
            mockActiveTouchPointers.delete("touch2");

            await execute(mockEvent);
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(1);
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の連続実行でもパフォーマンスが安定している", async () => {
            const iterations = 100;
            const start = performance.now();

            const promises = [];
            for (let i = 0; i < iterations; i++) {
                promises.push(execute(mockEvent));
            }

            await Promise.all(promises);

            const end = performance.now();
            const duration = end - start;

            // 100回の実行が500ms以内で完了することを期待
            expect(duration).toBeLessThan(500);

            // すべての呼び出しが実行されたことを確認
            expect(mockTimelineToolPlayStopUseCase).toHaveBeenCalledTimes(iterations);
        });
    });

    describe("エッジケース", () => {
        it("eventオブジェクトがnullの場合", async () => {
            await expect(execute(null as any)).rejects.toThrow();
        });

        it("eventオブジェクトがundefinedの場合", async () => {
            await expect(execute(undefined as any)).rejects.toThrow();
        });

        it("buttonプロパティが存在しない場合", async () => {
            const invalidEvent = {
                stopPropagation: vi.fn()
            } as any;

            await execute(invalidEvent);

            // button が undefined なので、!== 0 で true になり処理されない
            expect(mockTimelineToolPlayStopUseCase).not.toHaveBeenCalled();
        });

        it("stopPropagationメソッドが存在しない場合", async () => {
            const invalidEvent = {
                button: 0
            } as any;

            await expect(execute(invalidEvent)).rejects.toThrow();
        });
    });
});
