let font;
let points;
let logo; // 用于存储导入的 logo 图片
let shouldDraw = true; // 初始设为true以触发初始绘制
let gui;
let params = {
    inputText: "杂乱",
    fontSize: 300,
    color: "#11aa22",
    charSpacing: 0.2,
    polygonSize: 18,
    saveFormat: 'png' // 默认保存格式为png
};
const logoURL = 'https://www.xiaohongshu.com/user/profile/5ebe4828000000000101d273'; // 替换为你的链接

function preload() {
    font = loadFont('方正准圆简体.ttf');
    logo = loadImage('1.png'); // 替换为你的 logo 图片路径
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    noFill();
    background(255);

    // 创建 dat.GUI 并添加控件
    gui = new dat.GUI();
    
    // 创建单独的文件夹并添加控件
    let textFolder = gui.addFolder('Text Settings');
    textFolder.add(params, 'inputText').name('Text').onChange(handleInput);

    let sizeFolder = gui.addFolder('Font Size Settings');
    sizeFolder.add(params, 'fontSize', 280, 460).name('Font Size').onChange(handleInput);

    let spacingFolder = gui.addFolder('Spacing Settings');
    spacingFolder.add(params, 'charSpacing', 0, 0.5, 0.01).name('Char Spacing').onChange(handleInput);
  
    let polygonFolder = gui.addFolder('Polygon Size Settings');
    polygonFolder.add(params, 'polygonSize', 14, 28).name('Polygon Size').onChange(handleInput);

    let colorFolder = gui.addFolder('Color Settings');
    colorFolder.addColor(params, 'color').name('Color').onChange(handleInput);

    let saveFolder = gui.addFolder('Save Settings');
    saveFolder.add(params, 'saveFormat', ['png', 'jpg']).name('Save Format');
    saveFolder.add({ saveImage }, 'saveImage').name('Save Image');

    textFolder.open();
    saveFolder.open();

    // 初始显示文字
    handleInput();
}

function draw() {
    if (shouldDraw) {
        background(255);

        let inputText = params.inputText;
        if (inputText.length > 0) {
            // 计算整个文本的总宽度
            let totalWidth = 0;
            for (let char of inputText) {
                let charWidth = font.textBounds(char, 0, 0, params.fontSize).w;
                totalWidth += charWidth + (params.fontSize * params.charSpacing);
            }
            totalWidth -= params.fontSize * params.charSpacing; // 调整最后一个字符的间距

            // 起始x位置
            let x = width / 2 - totalWidth / 2;
            let y = height / 2 + params.fontSize / 2;

            stroke(params.color);

            for (let char of inputText) {
                let charWidth = font.textBounds(char, 0, 0, params.fontSize).w;
                points = font.textToPoints(char, x, y, params.fontSize, {
                    sampleFactor: 0.03, // 固定密度
                    simplifyThreshold: 0
                });

                points.forEach((item, i) => {
                    rubble({ pos: createVector(item.x, item.y), a: 0, w: 8, h: 5 });
                });

                x += charWidth + (params.fontSize * params.charSpacing);
            }
        }

        // 保存当前绘图设置
        push();
      
        // 添加版权信息
        noStroke();
        fill(0);
        textSize(12);
        textAlign(RIGHT, BOTTOM);
        text("Created by @Zhijie-Yi @LuANyxxx\n ©️All my products are available for personal and commercial projects", width - 10, height - 10);
        // 恢复之前的绘图设置
        pop();

        shouldDraw = false; // 设置为false以停止重复绘制
    }
    // 绘制 logo 图片
    const logoSize = 35;
    const logoX = 15;
    const logoY = height - logoSize - 10;  // 调整这个值以确定logo的位置
    image(logo, logoX, logoY, logoSize, logoSize);

    // 检测鼠标是否在 logo 区域
    if (mouseX > logoX && mouseX < logoX + logoSize && mouseY > logoY && mouseY < logoY + logoSize) {
        cursor(HAND); // 将指针变为手指形状
    } else {
        cursor(ARROW); // 将指针变回箭头形状
    }
}

function mousePressed() {
    const logoSize = 35;
    const logoX = 15;
    const logoY = height - logoSize - 10; 
    if (mouseX > logoX && mouseX < logoX + logoSize && mouseY > logoY && mouseY < logoY + logoSize) {
        window.open(logoURL, '_blank');
    }
}

function handleInput() {
    shouldDraw = true; // 当输入框内容变化时，设置为true以触发重新绘制
    redraw();
}

function rubble(obj) {
    let p = [];

    for (let i = 0; i < 30; i++) p.push(createVector(myGaussian() * obj.w, myGaussian() * obj.h));
    push();
    translate(obj.pos.x, obj.pos.y);
    rotate(obj.a);
    p.forEach(function (item) {
        beginShape();
        regularPolygon(item.x, item.y, random([2, 3, 4]), params.polygonSize).forEach(function (item2) {
            vertex(item2.x, item2.y);
        });
        endShape(CLOSE);
    });
    pop();
}

function saveImage() {
    // 创建一个临时的图形对象
    let pg = createGraphics(width, height);
    
    pg.noFill();
    pg.background(255);

    let inputText = params.inputText;
    if (inputText.length > 0) {
        // 计算整个文本的总宽度
        let totalWidth = 0;
        for (let char of inputText) {
            let charWidth = font.textBounds(char, 0, 0, params.fontSize).w;
            totalWidth += charWidth + (params.fontSize * params.charSpacing);
        }
        totalWidth -= params.fontSize * params.charSpacing; // 调整最后一个字符的间距

        // 起始x位置
        let x = pg.width / 2 - totalWidth / 2;
        let y = pg.height / 2 + params.fontSize / 2;

        pg.stroke(params.color);

        for (let char of inputText) {
            let charWidth = font.textBounds(char, 0, 0, params.fontSize).w;
            points = font.textToPoints(char, x, y, params.fontSize, {
                sampleFactor: 0.03, // 固定密度
                simplifyThreshold: 0
            });

            points.forEach((item, i) => {
                rubbleGraphics(pg, { pos: createVector(item.x, item.y), a: 0, w: 8, h: 5 });
            });

            x += charWidth + (params.fontSize * params.charSpacing);
        }
    }

    // 保存图像，不包含版权信息和logo
    save(pg, 'output.' + params.saveFormat);
}

function rubbleGraphics(pg, obj) {
    let p = [];

    for (let i = 0; i < 30; i++) p.push(createVector(myGaussian() * obj.w, myGaussian() * obj.h));
    pg.push();
    pg.translate(obj.pos.x, obj.pos.y);
    pg.rotate(obj.a);
    p.forEach(function (item) {
        pg.beginShape();
        regularPolygon(item.x, item.y, random([2, 3, 4]), params.polygonSize).forEach(function (item2) {
            pg.vertex(item2.x, item2.y);
        });
        pg.endShape(CLOSE);
    });
    pg.pop();
}

function regularPolygon(cx, cy, n, r) {
    let points = [];
    let a = random(TAU);
    for (let i = 0; i < n; i++) {
        let angle = map(i, 0, n, a, 2 * PI + a);
        let x = cx + r * cos(angle);
        let y = cy + r * sin(angle);
        points.push(createVector(x, y));
    }
    return points;
}

function myGaussian() {
    let x1, x2, rad;
    do {
        x1 = 2 * random(1) - 1;
        x2 = 2 * random(1) - 1;
        rad = x1 * x1 + x2 * x2;
    } while (rad >= 1 || rad == 0);
    let c = sqrt(-2 * Math.log(rad) / rad);
    return x1 * c;
}



