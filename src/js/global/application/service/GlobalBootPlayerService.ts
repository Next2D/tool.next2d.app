import { $setRoot } from "@/global/GlobalUtil";

/**
 * @description Next2D Playerを起動
 *              Boot Next2D Player
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (): Promise<void> =>
{
    const root = await next2d.createRootMovieClip(1024, 1024, 60);
    $setRoot(root);
};