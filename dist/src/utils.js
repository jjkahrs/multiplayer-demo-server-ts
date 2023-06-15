"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = void 0;
const open3d_1 = require("open3d");
const normalize = (vec) => {
    const magnitude = vec.Length;
    if (magnitude === 0)
        return open3d_1.Vector3d.Zero;
    let x = vec.X / magnitude;
    let y = vec.Y / magnitude;
    let z = vec.Z / magnitude;
    let newVec = new open3d_1.Vector3d(x, y, z);
    console.log(newVec, (vec.Divide(magnitude)));
    return newVec;
};
exports.normalize = normalize;
