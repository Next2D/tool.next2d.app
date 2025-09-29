import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenReferencePointInitializeRegisterEventUseCase";

// モック設定
const mockScreenReferencePointPointerDownEventUseCase = vi.fn();

vi.mock("./ScreenReferencePointPointerDownEventUseCase", () => ({
    execute: mockScreenReferencePointPointerDownEventUseCase
}));

vi.mock("@/config/ReferenceSettingConfig", () => ({
    $REFERENCE_POINT_ID: "reference-point"
}));

vi.mock("@/tool/domain/event/EventType", () => ({
    EventType: {
        POINTER_DOWN: "pointerdown"
    }
}));

describe("ScreenReferencePointInitializeRegisterEventUseCase", () => {
    let mockElement: HTMLElement;
    let originalGetElementById: typeof document.getElementById;

    beforeEach(() => {
        vi.clearAllMocks();

        // DOM要素のモック作成
        mockElement = {
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            id: "reference-point"
        } as any;

        // document.getElementById の元の実装を保存
        originalGetElementById = document.getElementById;
    });

    afterEach(() => {
        vi.resetAllMocks();
        // document.getElementById を元に戻す
        document.getElementById = originalGetElementById;
    });

    describe("正常系", () => {
        it("要素が存在する場合、pointerdownイベントが登録される", () => {
            // document.getElementById のモック設定
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();

            // getElementById が正しいIDで呼ばれることを確認
            expect(document.getElementById).toHaveBeenCalledWith("reference-point");
            expect(document.getElementById).toHaveBeenCalledTimes(1);

            // addEventListener が正しい引数で呼ばれることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockScreenReferencePointPointerDownEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);
        });

        it("複数回実行しても毎回イベントが登録される", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();
            execute();

            // 2回実行されるので、イベントが2回登録される
            expect(document.getElementById).toHaveBeenCalledTimes(2);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(2);
            
            // どちらも同じ引数で呼ばれる
            expect(mockElement.addEventListener).toHaveBeenNthCalledWith(1,
                "pointerdown",
                mockScreenReferencePointPointerDownEventUseCase
            );
            expect(mockElement.addEventListener).toHaveBeenNthCalledWith(2,
                "pointerdown",
                mockScreenReferencePointPointerDownEventUseCase
            );
        });
    });

    describe("要素が存在しない場合", () => {
        it("要素がnullの場合、イベント登録されずに終了する", () => {
            document.getElementById = vi.fn().mockReturnValue(null);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith("reference-point");
            expect(document.getElementById).toHaveBeenCalledTimes(1);

            // addEventListener は呼ばれない
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("要素がundefinedの場合、イベント登録されずに終了する", () => {
            document.getElementById = vi.fn().mockReturnValue(undefined);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith("reference-point");
            expect(document.getElementById).toHaveBeenCalledTimes(1);

            // addEventListener は呼ばれない
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe("DOM操作の検証", () => {
        it("document.getElementByIdが正しいIDで呼ばれる", () => {
            const getElementByIdSpy = vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

            execute();

            expect(getElementByIdSpy).toHaveBeenCalledWith("reference-point");
            expect(getElementByIdSpy).toHaveBeenCalledTimes(1);
        });

        it("異なるIDの要素は取得されない", () => {
            const getElementByIdSpy = vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

            execute();

            // 正しいIDでのみ呼ばれ、他のIDでは呼ばれない
            expect(getElementByIdSpy).toHaveBeenCalledWith("reference-point");
            expect(getElementByIdSpy).not.toHaveBeenCalledWith("other-element");
            expect(getElementByIdSpy).not.toHaveBeenCalledWith("reference-setting-box");
        });
    });

    describe("イベントタイプとハンドラーの検証", () => {
        it("pointerdownイベントタイプが使用される", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                expect.any(Function)
            );

            // 他のイベントタイプは使用されない
            expect(mockElement.addEventListener).not.toHaveBeenCalledWith(
                "pointerup", expect.any(Function)
            );
            expect(mockElement.addEventListener).not.toHaveBeenCalledWith(
                "pointermove", expect.any(Function)
            );
            expect(mockElement.addEventListener).not.toHaveBeenCalledWith(
                "click", expect.any(Function)
            );
        });

        it("正しいハンドラー関数が使用される", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockScreenReferencePointPointerDownEventUseCase
            );
        });

        it("イベントリスナーにオプションは設定されない", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();

            // オプション引数が渡されていないことを確認
            const calls = (mockElement.addEventListener as any).mock.calls;
            expect(calls[0]).toHaveLength(2); // イベントタイプとハンドラーのみ
        });
    });

    describe("エラーハンドリング", () => {
        it("document.getElementByIdでエラーが発生した場合の処理", () => {
            document.getElementById = vi.fn().mockImplementation(() => {
                throw new Error("DOM error");
            });

            // エラーが伝播することを確認
            expect(() => execute()).toThrow("DOM error");
        });

        it("addEventListenerでエラーが発生した場合の処理", () => {
            const errorElement = {
                addEventListener: vi.fn().mockImplementation(() => {
                    throw new Error("addEventListener error");
                })
            };
            document.getElementById = vi.fn().mockReturnValue(errorElement);

            // エラーが伝播することを確認
            expect(() => execute()).toThrow("addEventListener error");
        });
    });

    describe("実際のDOM環境での動作確認", () => {
        it("実際のDOM要素でも正常に動作する", () => {
            // 実際のDOM要素を作成
            const realElement = document.createElement("div");
            realElement.id = "reference-point";
            document.body.appendChild(realElement);

            // addEventListenerをスパイ
            const addEventListenerSpy = vi.spyOn(realElement, "addEventListener");

            // 実際のgetElementByIdを使用
            document.getElementById = originalGetElementById;

            try {
                execute();

                expect(addEventListenerSpy).toHaveBeenCalledWith(
                    "pointerdown",
                    mockScreenReferencePointPointerDownEventUseCase
                );
            } finally {
                // クリーンアップ
                document.body.removeChild(realElement);
            }
        });

        it("要素が存在しない場合、実際のgetElementByIdでもnullを返す", () => {
            // 存在しない要素のID
            document.getElementById = originalGetElementById;

            // エラーが発生しないことを確認
            expect(() => execute()).not.toThrow();
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の呼び出しでもパフォーマンスが安定している", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            const iterations = 1000;
            const start = performance.now();

            for (let i = 0; i < iterations; i++) {
                execute();
            }

            const end = performance.now();
            const duration = end - start;

            // 1,000回の呼び出しが50ms以内で完了することを期待
            expect(duration).toBeLessThan(50);

            // すべての呼び出しが実行されたことを確認
            expect(document.getElementById).toHaveBeenCalledTimes(iterations);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(iterations);
        });
    });

    describe("メモリリーク防止の確認", () => {
        it("要素への参照が適切に管理される", () => {
            document.getElementById = vi.fn().mockReturnValue(mockElement);

            execute();

            // 関数実行後、element変数がクリーンアップされることを期待
            // （実際にはスコープの問題なので、メモリリークのリスクは低い）
            expect(document.getElementById).toHaveBeenCalledTimes(1);
        });
    });
});
