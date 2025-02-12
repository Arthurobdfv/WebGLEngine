export const identity = new Float32Array([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
  ])

export class mat {
    /**
     *
     */    
    constructor(dimension) {
       values = new Float32Array(dimension * dimension);
       for(let i = 0; i< (dimension*dimension); i++){
        values[i] = i % dimension == 0 ? 1 : 0;
       };
    }

function asRedimention(newDimension){
  return values.filter((x, idx) => (idx%newDimension) < newDimension);
 }
}