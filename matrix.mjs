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
       this.dimension = dimension;
       this.values = new Float32Array(dimension * dimension);
       for(let i = 0; i< (dimension*dimension); i++){
        this.values[i] = i % dimension == 0 ? 1 : 0;
       };
    }

function asNewDimention(newDimension){
if(newDimension < this.dimension){
  return this.values.slice(0,newDimension*this.dimension).filter((val,idx) => (idx%this.dimension) < newDimension);
 }
}
}