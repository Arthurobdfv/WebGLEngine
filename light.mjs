const LightType = {
    Ambient: 0,
    Point: 1,
    Spot: 2,
    Directional: 3,
}


export default class Light {
    LightType;
    DirectionComponent = [];
    Intensity = 1;
    Color = [];

    constructor() {
        this.LightType = LightType.Ambient;
        this.DirectionComponent = [-1,-1,-1];            
        this.Color = [0.7,0.7,0.4];            
    }
}

