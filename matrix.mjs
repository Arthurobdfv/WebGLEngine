export const identity = new Float32Array([
  1,0,0,0,
  0,1,0,0,
  0,0,1,0,
  0,0,0,1
])

export const deg2rad = 0.017453;

export class mat {
  /**
   *
   */    
  t = new Float32Array(3);
  r = new Float32Array(3);
  s = new Float32Array([ 1, 1, 1,]);

  constructor(dimension) {
     this.dimension = dimension;
     this.values = new Float32Array(dimension * dimension);
     for(let i = 0; i< (dimension*dimension); i++){
      this.values[i] = i % (dimension+1) == 0 ? 1 : 0;
     };
  }

asNewDimention(newDimension){
    if(newDimension < this.dimension){
      return this.values.slice(0,newDimension*this.dimension).filter((val,idx) => (idx%this.dimension) < newDimension);
    }
  }

  position(x, y, z = 0){
    this.t = new Float32Array([x, y, z]);
  }

  scale(x, y, z = 1){
    this.s = new Float32Array([x, y, z]);
  }

  rotation(angle, angle2 = 0){
    this.r = new Float32Array([angle, angle2]);
  }

  toMvp(){
    var copy = new Float32Array(this.values);
    copy[0] = this.s[0] * Math.cos(deg2rad * this.r[0]);
    copy[1] = -Math.sin(deg2rad * this.r[0]);
    copy[this.dimension] = Math.sin(deg2rad * this.r[0]);
    copy[this.dimension+1] = this.s[1]*Math.cos(deg2rad * this.r[0]);
    copy[this.dimension+2] = this.s[2];
    copy[this.dimension*(this.dimension-1)] = this.t[0];
    copy[this.dimension*((this.dimension-1)+1)] = this.t[1];
    copy[this.dimension*((this.dimension-1)+2)] = this.t[2];
    copy[this.dimension*((this.dimension-1)+2)] = 1;
    return copy;
  }


}
