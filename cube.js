/*
Spinning Cube with node.js 
Ayden H
*/

var height = process.stdout.rows, width = process.stdout.columns, swapped = true;
buffer = [], triangles = [], rotated = [];
const FPS = 15;

generateScene();
drawFrame(1);

function generateScene(){
    function generateTriangle(ax, ay, az, bx, by, bz, cx, cy, cz, luminance){
        triangles.push([
            {x:ax, y:ay*-.5, z:az}, 
            {x:bx, y:by*-.5, z:bz}, 
            {x:cx, y:cy*-.5, z:cz},
            luminance 
        ]);
    }
    function generatePlane(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, luminance){
        generateTriangle(ax, ay, az,  bx, by, bz,  cx, cy, cz,  luminance);
        generateTriangle(ax, ay, az,  cx, cy, cz,  dx, dy, dz,  luminance);
    }
    triangles = [], w = width * 0.15;

    generatePlane(-w, w, w,  w, w, w,  w, -w, w,  -w, -w, w,  4);
    generatePlane(-w, -w, -w,  w, -w, -w,  w, w, -w,  -w, w, -w,  3);
    generatePlane(w, -w, w,  w, w, w,  w, w, -w,  w, -w, -w,  2);
    generatePlane(-w, -w, -w,  -w, w, -w,  -w, w, w,  -w, -w, w,  1);
    generatePlane(-w, w, -w,  w, w, -w,  w, w, w,  -w, w, w,  0);
}

function drawFrame(frame){
    function triangleIntersecting(pt, v1, v2, v3){
        function sign(p1, p2, p3){
            return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y) > 0;
        }
        offX = width/2, offY = height/2;
        vert1 = {x: v1.x + offX, y: v1.y + offY};
        vert2 = {x: v2.x + offX, y: v2.y + offY};
        vert3 = {x: v3.x + offX, y: v3.y + offY};
        return sign(pt, vert1, vert2) && sign(pt, vert2, vert3) && sign(pt, vert3, vert1);
    }

    rotated = JSON.parse(JSON.stringify(triangles));
    var rx = -0.15;
    var ry = frame * 0.07;

    rotated.forEach((tri, index, array) => {
        for(v = 0; v < 3; v++){
            let x = triangles[index][v].x;
            let y = rotated[index][v].y;
            let z = triangles[index][v].z;
            rotated[index][v].x = (x * Math.cos(ry)) + (z * Math.sin(ry));
            rotated[index][v].z = (z * Math.cos(ry)) - (x * Math.sin(ry));
            z = rotated[index][v].z;
            rotated[index][v].y = (y * Math.cos(rx)) - (z * Math.sin(rx));
            rotated[index][v].z = (y * Math.sin(rx)) + (z * Math.cos(rx));
    })

    console.clear();
    for (y = 0; y < height; y++){
        var row = "";
        for (x = 0; x < width; x++) {
            current = " ";
            rotated.forEach((tri) => {
                if(triangleIntersecting({x:x, y:y}, tri[0], tri[1], tri[2])){
                    current = ".=!#$"[tri[3]];
                }
            });
            row += current;
        }
        process.stdout.write(row + (y == height-1 ? "" : "\n"));
    }
    setTimeout(() => drawFrame(frame + 1), 1000 / FPS);
}

