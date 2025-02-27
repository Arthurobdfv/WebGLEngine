class Vec3 {
    x;
    y;
    z;
    
    /**
     *
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sqrMag() {
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }

    Mag() {
        return Math.sqrt(this.sqrMag());
    }

    cross(b){
        return new Vec3(this.y * b.z - this.z * b.y,
                this.z * b.x - this.x * b.z,
                this.x * b.y - this.y * b.x);
    }

    minus(b){
        return new Vec3(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    static normalize(v){
        var length = v.Mag();
        return new Vec3(v.x/length, v.y/length, v.z/length);
    }

    toArray(){
        return [this.x, this.y, this.z];
    }
}