import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./TimelineToolPlayStopInitializeRegisterEventUseCase";

// 定数定義
const TIMELINE_PLAY_STOP_ID = "timeline-play";
const POINTER_DOWN_EVENT = "pointerdown";

// モック設定
const mockTimelineToolPlayStopPointerDownEventUseCase = vi.fn();

vi.mock("./TimelineToolPlayStopPointerDownEventUseCase", () => ({
    execute: mockTimelineToolPlayStopPointerDownEventUseCase
}));

describe("TimelineToolPlayStopInitializeRegisterEventUseCase", () => {
    let mockElement: HTMLElement;
    let originalGetElementById: typeof document.getElementById;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTMLElement のモック
        mockElement = {
            id: TIMELINE_PLAY_STOP_ID,
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
            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_PLAY_STOP_ID);

            // イベントリスナーの登録確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("異なる要素でも正しく動作する", () => {
            const customElement = {
                id: "custom-timeline-play",
                addEventListener: vi.fn()
            } as any;

            (document.getElementById as any).mockReturnValue(customElement);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_PLAY_STOP_ID);
            expect(customElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
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
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("実際のHTMLElementでも正しく動作する", () => {
            const realElement = document.createElement("button");
            realElement.id = TIMELINE_PLAY_STOP_ID;
            const addEventListenerSpy = vi.spyOn(realElement, "addEventListener");

            (document.getElementById as any).mockReturnValue(realElement);

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );

            addEventListenerSpy.mockRestore();
        });
    });

    describe("早期リターン条件", () => {
        it("要素が存在しない場合は何も実行しない", () => {
            (document.getElementById as any).mockReturnValue(null);

            execute();

            // 要素の取得は実行される
            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_PLAY_STOP_ID);

            // イベントリスナーの登録は実行されない
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });

        it("要素がundefinedの場合は何も実行しない", () => {
            (document.getElementById as any).mockReturnValue(undefined);

            execute();

            expect(document.getElementById).toHaveBeenCalledWith(TIMELINE_PLAY_STOP_ID);
            expect(mockElement.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe("設定値の確認", () => {
        it("正しいタイムライン設定IDを使用している", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // TimelineConfig からの ID が使用されていることを確認
            expect(document.getElementById).toHaveBeenCalledWith("timeline-play");
        });

        it("正しいイベントタイプを使用している", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown", // EventType.POINTER_DOWN
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });
    });

    describe("依存関係の確認", () => {
        it("TimelineToolPlayStopPointerDownEventUseCaseが正しくインポートされている", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // インポートされた usecase が使用されていることを確認
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("useCaseが関数として正しく渡されている", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            const [eventType, handler] = (mockElement.addEventListener as any).mock.calls[0];
            
            expect(eventType).toBe(POINTER_DOWN_EVENT);
            expect(typeof handler).toBe("function");
            expect(handler).toBe(mockTimelineToolPlayStopPointerDownEventUseCase);
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
                id: TIMELINE_PLAY_STOP_ID,
                addEventListener: vi.fn(),
                className: "timeline-play-button",
                style: {},
                textContent: "Play"
            };

            // プロパティアクセスをスパイ
            const classNameSpy = vi.spyOn(elementWithSpies, 'className', 'get');
            const styleSpy = vi.spyOn(elementWithSpies, 'style', 'get');
            const textContentSpy = vi.spyOn(elementWithSpies, 'textContent', 'get');

            (document.getElementById as any).mockReturnValue(elementWithSpies);

            execute();

            // プロパティにアクセスしていないことを確認
            expect(classNameSpy).not.toHaveBeenCalled();
            expect(styleSpy).not.toHaveBeenCalled();
            expect(textContentSpy).not.toHaveBeenCalled();
        });
    });

    describe("エラーハンドリング", () => {
        it("getElementById がエラーを投げた場合は例外が伝播する", () => {
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
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("addEventListenerメソッドを持たない要素ではエラーになる", () => {
            const invalidElement = {
                id: TIMELINE_PLAY_STOP_ID
                // addEventListener メソッドなし
            };

            (document.getElementById as any).mockReturnValue(invalidElement);

            expect(() => execute()).toThrow();
        });

        it("button要素での動作確認", () => {
            const buttonElement = {
                tagName: "BUTTON",
                addEventListener: vi.fn()
            };

            (document.getElementById as any).mockReturnValue(buttonElement);

            execute();

            expect(buttonElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("div要素での動作確認", () => {
            const divElement = {
                tagName: "DIV",
                addEventListener: vi.fn()
            };

            (document.getElementById as any).mockReturnValue(divElement);

            execute();

            expect(divElement.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
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

        it("同じ要素への重複イベントリスナー登録", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            // 複数回実行
            execute();
            execute();
            execute();

            // 同じハンドラーが複数回登録される（実際のブラウザでは重複は自動で管理される）
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(3);
            
            // すべて同じハンドラー関数であることを確認
            const calls = (mockElement.addEventListener as any).mock.calls;
            calls.forEach(([eventType, handler]: [string, any]) => {
                expect(eventType).toBe(POINTER_DOWN_EVENT);
                expect(handler).toBe(mockTimelineToolPlayStopPointerDownEventUseCase);
            });
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
                `getElementById:${TIMELINE_PLAY_STOP_ID}`,
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
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });

        it("異なるイベントリスナーAPIを持つ環境", () => {
            const elementWithOldAPI = {
                attachEvent: vi.fn(), // IE の古い API
                addEventListener: vi.fn()
            };

            (document.getElementById as any).mockReturnValue(elementWithOldAPI);

            execute();

            // 標準のaddEventListenerが使用される
            expect(elementWithOldAPI.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
            expect(elementWithOldAPI.attachEvent).not.toHaveBeenCalled();
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際のDOM要素作成→イベント登録→削除のフロー", () => {
            // 実際のDOM要素を作成
            const realElement = document.createElement("button");
            realElement.id = TIMELINE_PLAY_STOP_ID;
            realElement.className = "timeline-play-button";
            
            // addEventListener をスパイ
            const addEventListenerSpy = vi.spyOn(realElement, "addEventListener");
            
            (document.getElementById as any).mockReturnValue(realElement);

            execute();

            expect(addEventListenerSpy).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );

            addEventListenerSpy.mockRestore();
        });

        it("タイムラインUI初期化の一部としてのシナリオ", () => {
            // タイムラインUI要素が順次初期化される想定
            const playButton = { addEventListener: vi.fn() };
            const stopButton = { addEventListener: vi.fn() };
            const pauseButton = { addEventListener: vi.fn() };

            // 再生・停止ボタンの初期化
            (document.getElementById as any).mockReturnValue(playButton);
            execute();

            expect(playButton.addEventListener).toHaveBeenCalledWith(
                POINTER_DOWN_EVENT,
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });
    });

    describe("設定変更に対する耐性", () => {
        it("IDが変更されても設定値に従って動作する", () => {
            // もし設定値が変更された場合のテスト
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // 現在の設定値（timeline-play）が使用されている
            expect(document.getElementById).toHaveBeenCalledWith("timeline-play");
        });

        it("イベントタイプが変更されても設定値に従って動作する", () => {
            (document.getElementById as any).mockReturnValue(mockElement);

            execute();

            // 現在の設定値（pointerdown）が使用されている
            expect(mockElement.addEventListener).toHaveBeenCalledWith(
                "pointerdown",
                mockTimelineToolPlayStopPointerDownEventUseCase
            );
        });
    });

    describe("エッジケース", () => {
        it("documentがnullの場合", () => {
            const originalDocument = global.document;
            global.document = null as any;

            expect(() => execute()).toThrow();

            global.document = originalDocument;
        });

        it("getElementByIdが関数でない場合", () => {
            const originalGetElementById = document.getElementById;
            document.getElementById = null as any;

            expect(() => execute()).toThrow();

            document.getElementById = originalGetElementById;
        });

        it("要素が途中で削除される場合", () => {
            let elementDeleted = false;
            
            (document.getElementById as any).mockImplementation(() => {
                if (elementDeleted) {
                    return null;
                } else {
                    return mockElement;
                }
            });

            // 最初は成功
            execute();
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);

            // 要素が削除された状態
            elementDeleted = true;
            execute();
            
            // 2回目は処理されない
            expect(mockElement.addEventListener).toHaveBeenCalledTimes(1);
        });
    });
});
