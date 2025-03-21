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
  last = 1;
  fudge = 0;

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

  rotation(x = 0, y = 0 , z = 0 ){
    this.r = new Float32Array([x, y, z]);
  }

  getPos(){
     return new Float32Array([this.t[0], this.t[1], this.t[2]]);
  }

  toMvp(last = 1){
    var copy = new Float32Array(this.values);
    copy[0] = this.s[0] * Math.cos(deg2rad * this.r[1]) * Math.cos(deg2rad * this.r[2]);
    copy[1] = Math.sin(deg2rad * this.r[2]);
    copy[2] = -Math.sin(deg2rad * this.r[1]);
    
    copy[this.dimension] = -Math.sin(deg2rad*this.r[2])
    copy[this.dimension+1] = this.s[1]*Math.cos(deg2rad * this.r[0]) * Math.cos(deg2rad*this.r[2]);
    copy[this.dimension+2] = Math.sin(deg2rad * this.r[0]);
    
    copy[2*this.dimension] = Math.sin(deg2rad*this.r[1]);
    copy[2*this.dimension+1] = -Math.sin(deg2rad*this.r[0]);
    copy[2*this.dimension+2] = this.s[2] * Math.cos(deg2rad*this.r[0])* Math.cos(deg2rad*this.r[1]);
    
    copy[this.dimension*(this.dimension-1)-1] = this.fudge;
    copy[this.dimension*(this.dimension-1)] = this.t[0];
    copy[this.dimension*((this.dimension-1))+1] = this.t[1];
    copy[this.dimension*((this.dimension-1))+2] = this.t[2];
    copy[this.dimension*this.dimension-1]=last;
    //copy[this.dimension*((this.dimension-1))+3] = 1;
    return copy;
  }


  inverse(){
    var m = this.toMvp();
      var m00 = m[0 * 4 + 0];
      var m01 = m[0 * 4 + 1];
      var m02 = m[0 * 4 + 2];
      var m03 = m[0 * 4 + 3];
      var m10 = m[1 * 4 + 0];
      var m11 = m[1 * 4 + 1];
      var m12 = m[1 * 4 + 2];
      var m13 = m[1 * 4 + 3];
      var m20 = m[2 * 4 + 0];
      var m21 = m[2 * 4 + 1];
      var m22 = m[2 * 4 + 2];
      var m23 = m[2 * 4 + 3];
      var m30 = m[3 * 4 + 0];
      var m31 = m[3 * 4 + 1];
      var m32 = m[3 * 4 + 2];
      var m33 = m[3 * 4 + 3];
      var tmp_0  = m22 * m33;
      var tmp_1  = m32 * m23;
      var tmp_2  = m12 * m33;
      var tmp_3  = m32 * m13;
      var tmp_4  = m12 * m23;
      var tmp_5  = m22 * m13;
      var tmp_6  = m02 * m33;
      var tmp_7  = m32 * m03;
      var tmp_8  = m02 * m23;
      var tmp_9  = m22 * m03;
      var tmp_10 = m02 * m13;
      var tmp_11 = m12 * m03;
      var tmp_12 = m20 * m31;
      var tmp_13 = m30 * m21;
      var tmp_14 = m10 * m31;
      var tmp_15 = m30 * m11;
      var tmp_16 = m10 * m21;
      var tmp_17 = m20 * m11;
      var tmp_18 = m00 * m31;
      var tmp_19 = m30 * m01;
      var tmp_20 = m00 * m21;
      var tmp_21 = m20 * m01;
      var tmp_22 = m00 * m11;
      var tmp_23 = m10 * m01;
  
      var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
               (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
      var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
               (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
      var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
               (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
      var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
               (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);
  
      var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
  
      return new Float32Array([
        d * t0,
        d * t1,
        d * t2,
        d * t3,
        d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
             (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
        d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
             (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
        d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
             (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
        d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
             (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
        d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
             (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
        d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
             (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
        d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
             (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
        d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
             (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
        d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
             (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
        d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
             (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
        d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
             (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
        d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
             (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
      ]);  }


}
