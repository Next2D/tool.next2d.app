/**
 * @class
 * @extends {BaseScreen}
 */
class SceneChange extends BaseScreen
{
    /**
     * @description 初期起動関数
     *
     * @return {void}
     * @method
     * @public
     */
    initialize ()
    {
        super.initialize();
    }

    /**
     * @description 指定のMovieClipを表示
     *
     * @param  {number} library_id
     * @return {void}
     * @method
     * @public
     */
    execute (library_id)
    {
        // 現在のプロジェクト
        const workSpace = Util.$currentWorkSpace();

        // ライブラリから指定のMovieClipを取得
        const scene = workSpace.getLibrary(library_id);
        const frame = scene.currentFrame;

        // 指定のMovieClipのフレーム
        Util.$timelineFrame.currentFrame = frame;

        // タイムラインのマーカーを移動
        Util.$timelineMarker.move();

        // 上部のタイムラインの位置を補正
        const base = document
            .getElementById("timeline-controller-base");

        // 表示画面の中心
        const moveX = (frame - 1) * (Util.$timelineTool.timelineWidth + 1);
        if (moveX > base.offsetWidth / 2) {
            Util
                .$timelineLayer
                .moveTimeLine(moveX - base.offsetWidth / 2);
        }

        workSpace.scene = scene;
    }
}

Util.$sceneChange = new SceneChange();
