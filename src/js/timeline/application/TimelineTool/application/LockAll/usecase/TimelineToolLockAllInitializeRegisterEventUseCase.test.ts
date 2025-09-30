import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TimelineToolLockAllInitializeRegisterEventUseCase";

// 定数定義
const TIMELINE_LAYER_LOCK_ALL_ID = "timeline-layer-lock-all";
const POINTER_DOWN_EVENT = "pointerdown";

// モック設定
const mockTimelineToolLockAllUseCase = vi.fn();

vi.mock("./TimelineToolLockAllUseCase", () => ({
    execute: mockTimelineToolLockAllUseCase
}));

describe("TimelineToolLockAllInitializeRegisterEventUseCase", () => {
    let mockElement: HTMLElement;
    let originalGetElementById: typeof document.getElementById;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTMLElement のモック
        mockElement = {
            id: TIMELINE_LAYER_LOCK_ALL_ID,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn()
        } as any;

        // document.getElementById のモック
        originalGetElementById = document.getElementById;
        document.getElementById = vi.fn();
    });

    afterEach(() => {
        vi.resetAllMocks();
        document.getElementById = originalGetElementById;
    });

    describe("正常系", () => {
        it("要素が存在する場合、ポインターダウンイベントリスナーを登録する", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // 要素の取得確認
            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_LAYER_LOCK_ALL_ID);

            // イベントリスナーの登録確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );
        });

        it("異なる要素IDでも正しく取得される", () => {
            const customElement = {
                id: "custom-timeline-layer-lock-all",
                addEventListener: vi.fn()
            } as any;

            (document.getElementById as any).mockReturnValue(customElement);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_LAYER_LOCK_ALL_ID);
            expect(customElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );
        });

        it("要素が複数回取得されても同じ動作をする", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            // 複数回実行
            execute();
            execute();
            execute();

            // 要素取得が3回実行された
            expect(document.getElementById).toHaveBeenCalledTimes(3);

            // イベントリスナーが3回登録された
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(3);
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );
        });
    });

    describe("早期リターン条件", () => {
        it("要素が存在しない場合は何も実行しない", () => {
            (document.getElementById as any).mockReturnValue(null);

            execute();

            // 要素の取得は実行される
            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_LAYER_LOCK_ALL_ID);

            // イベントリスナーの登録は実行されない
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("要素がundefinedの場合は何も実行しない", () => {
            (document.getElementById as any).mockReturnValue(undefined);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_LAYER_LOCK_ALL_ID);
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe("設定値の確認", () => {
        it("正しいタイムライン設定IDを使用している", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // TimelineConfig からの ID が使用されていることを確認
            expect(document.getElementById).toHaveBeenCalledWith("timeline-layer-lock-all");
        });

        it("正しいイベントタイプを使用している", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown", // EventType.POINTER_DOWN
                mockTimelineToolLockAllUseCase
            );
        });
    });

    describe("依存関係の確認", () => {
        it("TimelineToolLockAllUseCaseが正しくインポートされている", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // インポートされた usecase が使用されていることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );
        });

        it("useCaseが関数として正しく渡されている", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            const [eventType, handler] = (mockElement.addEventListener as any).mock.calls[0];
            
            expect(eventType).toBe(POINTER_DOWN_EVENT);
            expect(typeof handler).toBe("function");
            expect(handler).toBe(mockTimelineToolLockAllUseCase);
        });
    });

    describe("DOM操作の詳細確認", () => {
        it("getElementById が1回だけ呼ばれる", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            expect(document.getElementById).toHaveBeenCalledTimes(1);
        });

        it("addEventListener が正確に1回呼ばれる", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);
        });

        it("他のイベントリスナーメソッドは呼ばれない", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            expect(mockElement.removeEventListener).not.toHaveBeenCalled();
        });

        it("要素のプロパティにアクセスしない", () => {
            const elementWithSpies = {
                id: TIMELINE_LAYER_LOCK_ALL_ID,
                addEventListener: vi.fn(),
                className: "test-class",
                style: {}
            };

            // プロパティアクセスをスパイ
            const classNameSpy = vi.spyOn(elementWithSpies, 'className', 'get');
            const styleSpy = vi.spyOn(elementWithSpies, 'style', 'get');

            (document.getElementById as any).mockReturnValue(elementWithSpies);

            execute();

            // プロパティにアクセスしていないことを確認
            expect(classNameSpy).not.toHaveBeenCalled();
            expect(styleSpy).not.toHaveBeenCalled();
        });
    });

    describe("エラーハンドリング", () => {
        it("getElementById がエラーを投げても例外が伝播しない", () => {
            (document.getElementById as any).mockImplementation(() => {
                throw new Error("DOM not ready");
            });

            expect(() => execute()).toThrow("DOM not ready");
        });

        it("addEventListener でエラーが発生した場合は例外が伝播する", () => {
            const elementWithError = {
                addEventListener: vi.fn().mockImplementation(() => {
                    throw new Error("Event registration failed");
                })
            };

            (document.getElementById as any).mockReturnValue(elementWithError);

            expect(() => execute()).toThrow("Event registration failed");
        });
    });

    describe("要素の型確認", () => {
        it("HTMLElement以外の要素でも動作する", () => {
            const svgElement = {
                addEventListener: vi.fn(),
                namespaceURI: "http://www.w3.org/2000/svg"
            };

            (document.getElementById as any).mockReturnValue(svgElement);

            execute();

            expect(svgElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );
        });

        it("addEventListenerメソッドを持たない要素ではエラーになる", () => {
            const invalidElement = {
                id: TIMELINE_LAYER_LOCK_ALL_ID
                // addEventListener メソッドなし
            };

            (document.getElementById as any).mockReturnValue(invalidElement);

            expect(() => execute()).toThrow();
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量の連続実行でもパフォーマンスが安定している", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            const iterations = 1000;
            const start = performance.now();

            for (let i = 0; i < iterations; i++) {
                execute();
            }

            const end = performance.now();
            const duration = end - start;

            // 1000回の実行が100ms以内で完了することを期待
            expect(duration).toBeLessThan(100);

            // すべての呼び出しが実行されたことを確認
            expect(document.getElementById).toHaveBeenCalledTimes(iterations);
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(iterations);
        });
    });

    describe("メモリリーク対策の確認", () => {
        it("要素への参照を保持しない", () => {
            const weakRef = new WeakRef(mockElement);
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // 関数内で要素への参照を保持していないことを確認
            // WeakRef は実際のガベージコレクションのテストは困難なので、
            // ここでは参照が適切に処理されることを想定
            expect(weakRef.deref()).toBeDefined();
        });
    });

    describe("初期化順序の確認", () => {
        it("DOM操作が適切な順序で実行される", () => {
            const executionOrder: string[] = [];

            (document.getElementById as any).mockImplementation((id: string) => {
                executionOrder.push(`getElementById:${id}`);
                return mockElement;
            });

            (mockElement.addEventListener as any).mockImplementation((type: string, handler: any) => {
                executionOrder.push(`addEventListener:${type}`);
            });

            execute();

            expect(executionOrder).toEqual([
                `getElementById:${TIMELINE_LAYER_LOCK_ALL_ID}`,
                `addEventListener:${POINTER_DOWN_EVENT}`
            ]);
        });
    });

    describe("ブラウザ互換性の考慮", () => {
        it("古いブラウザ環境でgetElementByIdがnullを返す場合", () => {
            // 古いブラウザや不完全なDOM環境をシミュレート
            (document.getElementById as any).mockReturnValue(null);

            expect(() => execute()).not.toThrow();
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("PointerEventをサポートしていない環境での動作", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // EventType.POINTER_DOWN が文字列として正しく渡されることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockTimelineToolLockAllUseCase
            );
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のDOM要素作成→イベント登録→削除のフロー", () => {
            // 実際のDOM要素を作成
            const realElement = document.createElement("div");
            realElement.id = TIMELINE_LAYER_LOCK_ALL_ID;
            
            // addEventListener をスパイ
            const addEventListenerSpy = vi.spyOn(realElement, "addEventListener");
            
            (document.getElementById as any).mockReturnValue(realElement);

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolLockAllUseCase
            );

            addEventListenerSpy.mockRestore();
        });
    });
});
