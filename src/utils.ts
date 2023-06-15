import {Vector3d} from 'open3d';

export const normalize = ( vec : Vector3d ) => {
    const magnitude = vec.Length;

    if( magnitude === 0 )
        return Vector3d.Zero;

    let x = vec.X / magnitude;
    let y = vec.Y / magnitude;
    let z = vec.Z / magnitude;
    
    let newVec = new Vector3d(x, y, z);
    
    return newVec;
}