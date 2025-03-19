export const LightType = {
    Ambient: 0,
    Point: 1,
    Spot: 2,
    Directional: 3,
}


export class Light {
    LightType;
    DirectionComponent = [];
    Intensity = 1;
    Color = [];

    constructor(lightType = null, direction = null, color = null) {
        this.LightType = lightType ? lightType : LightType.Ambient;
        this.DirectionComponent = direction ? direction : [-1,-1,-1];            
        this.Color = color ? color : [0.7,0.7,0.4];            
    }
}

