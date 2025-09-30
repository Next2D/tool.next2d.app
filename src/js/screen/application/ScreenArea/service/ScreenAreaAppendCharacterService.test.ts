import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { execute } from "./ScreenAreaAppendCharacterService";

// 定数定義
const SCREEN_STAGE_AREA_ID = "stage-area";

describe("ScreenAreaAppendCharacterService", () => {
    let mockElement: HTMLElement;
    let mockCharacter: any;
    let mockLayer: any;
    let originalGetElementById: typeof document.getElementById;

    beforeEach(() => {
        vi.clearAllMocks();

        // HTMLElement のモック
        mockElement = {
            id: SCREEN_STAGE_AREA_ID,
            appendChild: vi.fn(),
            querySelector: vi.fn(),
            classList: {
                add: vi.fn(),
                remove: vi.fn()
            }
        } as any;

        // Character モック
        mockCharacter = {
            id: "character-1",
            name: "TestCharacter",
            createElement: vi.fn().mockResolvedValue(undefined)
        };

        // Layer モック
        mockLayer = {
            id: "layer-1",
            name: "TestLayer",
            index: 0,
            visible: true
        };

        // document.getElementById のモック
        originalGetElementById = document.getElementById;
        document.getElementById = vi.fn().mockReturnValue(mockElement);
    });

    afterEach(() => {
        vi.resetAllMocks();
        document.getElementById = originalGetElementById;
    });

    describe("正常系", () => {
        it("要素が存在する場合、キャラクターの要素が作成される", async () => {
            await execute(mockCharacter, mockLayer);

            // 要素の取得確認
            expect(document.getElementById).toHaveBeenCalledWith(SCREEN_STAGE_AREA_ID);

            // キャラクターの要素作成確認
            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("異なるキャラクターでも正しく動作する", async () => {
            const customCharacter = {
                id: "custom-character",
                name: "CustomCharacter",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(customCharacter, mockLayer);

            expect(document.getElementById).toHaveBeenCalledWith(SCREEN_STAGE_AREA_ID);
            expect(customCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("異なるレイヤーでも正しく動作する", async () => {
            const customLayer = {
                id: "custom-layer",
                name: "CustomLayer",
                index: 5,
                visible: false
            };

            await execute(mockCharacter, customLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, customLayer);
        });

        it("複数のキャラクターを順次追加できる", async () => {
            const character1 = {
                id: "char-1",
                createElement: vi.fn().mockResolvedValue(undefined)
            };
            const character2 = {
                id: "char-2",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(character1, mockLayer);
            await execute(character2, mockLayer);

            expect(character1.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
            expect(character2.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
            expect(document.getElementById).toHaveBeenCalledTimes(2);
        });

        it("同じキャラクターを複数回追加できる", async () => {
            await execute(mockCharacter, mockLayer);
            await execute(mockCharacter, mockLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledTimes(2);
            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });
    });

    describe("早期リターン条件", () => {
        it("要素が存在しない場合は処理を実行しない", async () => {
            document.getElementById = vi.fn().mockReturnValue(null);

            await execute(mockCharacter, mockLayer);

            // 要素の取得は実行される
            expect(document.getElementById).toHaveBeenCalledWith(SCREEN_STAGE_AREA_ID);

            // キャラクターの要素作成は実行されない
            expect(mockCharacter.createElement).not.toHaveBeenCalled();
        });

        it("要素がundefinedの場合は処理を実行しない", async () => {
            document.getElementById = vi.fn().mockReturnValue(undefined);

            await execute(mockCharacter, mockLayer);

            expect(document.getElementById).toHaveBeenCalledWith(SCREEN_STAGE_AREA_ID);
            expect(mockCharacter.createElement).not.toHaveBeenCalled();
        });
    });

    describe("非同期処理の確認", () => {
        it("createElementの非同期処理が完了するまで待機する", async () => {
            let createElementResolved = false;

            mockCharacter.createElement.mockImplementation(() => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        createElementResolved = true;
                        resolve(undefined);
                    }, 10);
                });
            });

            await execute(mockCharacter, mockLayer);

            expect(createElementResolved).toBe(true);
        });

        it("createElementでエラーが発生した場合は例外が伝播する", async () => {
            const error = new Error("createElement failed");
            mockCharacter.createElement.mockRejectedValue(error);

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow("createElement failed");
        });

        it("並行実行されても問題なく処理される", async () => {
            const character1 = {
                id: "char-1",
                createElement: vi.fn().mockResolvedValue(undefined)
            };
            const character2 = {
                id: "char-2",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            const promise1 = execute(character1, mockLayer);
            const promise2 = execute(character2, mockLayer);

            await Promise.all([promise1, promise2]);

            expect(character1.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
            expect(character2.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });
    });

    describe("DOM操作の確認", () => {
        it("getElementById が1回だけ呼ばれる", async () => {
            await execute(mockCharacter, mockLayer);

            expect(document.getElementById).toHaveBeenCalledTimes(1);
            expect(document.getElementById).toHaveBeenCalledWith(SCREEN_STAGE_AREA_ID);
        });

        it("スクリーンステージエリアの設定IDが使用される", async () => {
            await execute(mockCharacter, mockLayer);

            expect(document.getElementById).toHaveBeenCalledWith("stage-area");
        });

        it("要素のプロパティにアクセスしない", async () => {
            const elementWithSpies = {
                id: SCREEN_STAGE_AREA_ID,
                className: "stage-area-container",
                style: {},
                appendChild: vi.fn()
            };

            // プロパティアクセスをスパイ
            const classNameSpy = vi.spyOn(elementWithSpies, 'className', 'get');
            const styleSpy = vi.spyOn(elementWithSpies, 'style', 'get');

            document.getElementById = vi.fn().mockReturnValue(elementWithSpies);

            await execute(mockCharacter, mockLayer);

            // プロパティにアクセスしていないことを確認
            expect(classNameSpy).not.toHaveBeenCalled();
            expect(styleSpy).not.toHaveBeenCalled();
        });
    });

    describe("パラメータの検証", () => {
        it("characterが正しく渡される", async () => {
            const testCharacter = {
                id: "test-id",
                name: "Test Character",
                type: "MovieClip",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(testCharacter, mockLayer);

            expect(testCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("layerが正しく渡される", async () => {
            const testLayer = {
                id: "test-layer-id",
                name: "Test Layer",
                index: 10,
                visible: true,
                locked: false
            };

            await execute(mockCharacter, testLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, testLayer);
        });

        it("createElementの引数順序が正しい", async () => {
            await execute(mockCharacter, mockLayer);

            const [element, layer] = mockCharacter.createElement.mock.calls[0];
            expect(element).toBe(mockElement);
            expect(layer).toBe(mockLayer);
        });
    });

    describe("エラーハンドリング", () => {
        it("getElementById がエラーを投げた場合は例外が伝播する", async () => {
            document.getElementById = vi.fn().mockImplementation(() => {
                throw new Error("DOM not ready");
            });

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow("DOM not ready");

            expect(mockCharacter.createElement).not.toHaveBeenCalled();
        });

        it("createElementが同期的にエラーを投げた場合", async () => {
            mockCharacter.createElement.mockImplementation(() => {
                throw new Error("Synchronous createElement error");
            });

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow("Synchronous createElement error");
        });

        it("createElementが非同期でエラーを投げた場合", async () => {
            mockCharacter.createElement.mockRejectedValue(new Error("Async createElement error"));

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow("Async createElement error");
        });
    });

    describe("要素の型確認", () => {
        it("HTMLElement以外の要素でも動作する", async () => {
            const svgElement = {
                namespaceURI: "http://www.w3.org/2000/svg",
                tagName: "svg"
            };

            document.getElementById = vi.fn().mockReturnValue(svgElement);

            await execute(mockCharacter, mockLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(svgElement, mockLayer);
        });

        it("canvas要素での動作確認", async () => {
            const canvasElement = {
                tagName: "CANVAS",
                getContext: vi.fn()
            };

            document.getElementById = vi.fn().mockReturnValue(canvasElement);

            await execute(mockCharacter, mockLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(canvasElement, mockLayer);
        });

        it("div要素での動作確認", async () => {
            const divElement = {
                tagName: "DIV",
                appendChild: vi.fn()
            };

            document.getElementById = vi.fn().mockReturnValue(divElement);

            await execute(mockCharacter, mockLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(divElement, mockLayer);
        });
    });

    describe("キャラクターの型確認", () => {
        it("MovieClipキャラクターで動作する", async () => {
            const movieClipCharacter = {
                type: "MovieClip",
                frames: [],
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(movieClipCharacter, mockLayer);

            expect(movieClipCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("Shapeキャラクターで動作する", async () => {
            const shapeCharacter = {
                type: "Shape",
                graphics: {},
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(shapeCharacter, mockLayer);

            expect(shapeCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("Textキャラクターで動作する", async () => {
            const textCharacter = {
                type: "Text",
                text: "Hello World",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(textCharacter, mockLayer);

            expect(textCharacter.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
        });

        it("createElementメソッドを持たないオブジェクトではエラーになる", async () => {
            const invalidCharacter = {
                id: "invalid",
                name: "Invalid Character"
                // createElement メソッドなし
            };

            await expect(execute(invalidCharacter as any, mockLayer)).rejects.toThrow();
        });
    });

    describe("レイヤーの状態確認", () => {
        it("visibleがtrueのレイヤーで動作する", async () => {
            const visibleLayer = {
                id: "visible-layer",
                visible: true,
                index: 0
            };

            await execute(mockCharacter, visibleLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, visibleLayer);
        });

        it("visibleがfalseのレイヤーでも動作する", async () => {
            const hiddenLayer = {
                id: "hidden-layer",
                visible: false,
                index: 1
            };

            await execute(mockCharacter, hiddenLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, hiddenLayer);
        });

        it("lockedがtrueのレイヤーでも動作する", async () => {
            const lockedLayer = {
                id: "locked-layer",
                locked: true,
                index: 2
            };

            await execute(mockCharacter, lockedLayer);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, lockedLayer);
        });
    });

    describe("パフォーマンステスト", () => {
        it("大量のキャラクター追加でもパフォーマンスが安定している", async () => {
            const characters = Array.from({ length: 100 }, (_, i) => ({
                id: `char-${i}`,
                createElement: vi.fn().mockResolvedValue(undefined)
            }));

            const start = performance.now();

            const promises = characters.map(char => execute(char, mockLayer));
            await Promise.all(promises);

            const end = performance.now();
            const duration = end - start;

            // 100キャラクターの追加が500ms以内で完了することを期待
            expect(duration).toBeLessThan(500);

            // すべてのキャラクターが処理されたことを確認
            characters.forEach(char => {
                expect(char.createElement).toHaveBeenCalledWith(mockElement, mockLayer);
            });
        });

        it("連続実行でのメモリ効率性", async () => {
            for (let i = 0; i < 50; i++) {
                const character = {
                    id: `sequential-char-${i}`,
                    createElement: vi.fn().mockResolvedValue(undefined)
                };

                await execute(character, mockLayer);
                expect(character.createElement).toHaveBeenCalledOnce();
            }

            // DOM取得が各回実行されていることを確認
            expect(document.getElementById).toHaveBeenCalledTimes(50);
        });
    });

    describe("統合テスト風のシナリオ", () => {
        it("実際の使用シナリオ：キャラクターをスクリーンに配置", async () => {
            // 実際のDOM要素を作成
            const realElement = document.createElement("div");
            realElement.id = SCREEN_STAGE_AREA_ID;
            realElement.className = "stage-area";

            document.getElementById = vi.fn().mockReturnValue(realElement);

            const gameCharacter = {
                id: "hero",
                name: "Hero Character",
                x: 100,
                y: 150,
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            const gameLayer = {
                id: "character-layer",
                name: "Character Layer",
                index: 1,
                visible: true,
                depth: 10
            };

            await execute(gameCharacter, gameLayer);

            expect(gameCharacter.createElement).toHaveBeenCalledWith(realElement, gameLayer);
        });

        it("複数レイヤーでの複数キャラクター配置", async () => {
            const backgroundLayer = { id: "bg", index: 0 };
            const characterLayer = { id: "char", index: 1 };
            const uiLayer = { id: "ui", index: 2 };

            const backgroundChar = {
                id: "bg-char",
                createElement: vi.fn().mockResolvedValue(undefined)
            };
            const heroChar = {
                id: "hero-char",
                createElement: vi.fn().mockResolvedValue(undefined)
            };
            const uiChar = {
                id: "ui-char",
                createElement: vi.fn().mockResolvedValue(undefined)
            };

            await execute(backgroundChar, backgroundLayer);
            await execute(heroChar, characterLayer);
            await execute(uiChar, uiLayer);

            expect(backgroundChar.createElement).toHaveBeenCalledWith(mockElement, backgroundLayer);
            expect(heroChar.createElement).toHaveBeenCalledWith(mockElement, characterLayer);
            expect(uiChar.createElement).toHaveBeenCalledWith(mockElement, uiLayer);
        });
    });

    describe("エッジケース", () => {
        it("characterがnullの場合", async () => {
            await expect(execute(null as any, mockLayer)).rejects.toThrow();
        });

        it("characterがundefinedの場合", async () => {
            await expect(execute(undefined as any, mockLayer)).rejects.toThrow();
        });

        it("layerがnullの場合", async () => {
            await execute(mockCharacter, null as any);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, null);
        });

        it("layerがundefinedの場合", async () => {
            await execute(mockCharacter, undefined as any);

            expect(mockCharacter.createElement).toHaveBeenCalledWith(mockElement, undefined);
        });

        it("documentがnullの場合", async () => {
            const originalDocument = global.document;
            global.document = null as any;

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow();

            global.document = originalDocument;
        });

        it("getElementByIdが関数でない場合", async () => {
            const originalGetElementById = document.getElementById;
            document.getElementById = null as any;

            await expect(execute(mockCharacter, mockLayer)).rejects.toThrow();

            document.getElementById = originalGetElementById;
        });
    });

    describe("設定変更に対する耐性", () => {
        it("IDが変更されても設定値に従って動作する", async () => {
            await execute(mockCharacter, mockLayer);

            // 現在の設定値（stage-area）が使用されている
            expect(document.getElementById).toHaveBeenCalledWith("stage-area");
        });
    });
});
