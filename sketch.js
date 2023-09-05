// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var currentFilter = 0; // To keep track of the current filter
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
    pixelDensity(1);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////

function keyPressed() {
    // Update the current filter when a key is pressed
    if (key === '1') {
      currentFilter = 0;
    } else if (key === '2') {
      currentFilter = 1;
    } else if (key === '3') {
      currentFilter = 2;
    }
    // Re-draw the canvas to reflect the new filter
    loop();
}


function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
  resultImg = radialBlurFilter(imgIn);
  resultImg = sepiaFilter(resultImg);
  resultImg = darkCorners(resultImg);
  
  resultImg = borderFilter(resultImg)
  return resultImg;
}


// Early Bird Filter
function sepiaFilter(img) {
    // Create an empty image the same size as the original
    var imgOut = createImage(img.width, img.height);

    imgOut.loadPixels();
    img.loadPixels();

    // Loop through every pixel
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            // Calculate the 1D location from a 2D grid
            var index = (x + y * img.width) * 4;

            // Get the R,G,B values from image
            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];

            // Calculate newRed, newGreen, and newBlue
            newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189)
            newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168)
            newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131)

            // Set the pixel colors
            imgOut.pixels[index + 0] = newRed; // Reddish
            imgOut.pixels[index + 1] = newGreen; // Greenish
            imgOut.pixels[index + 2] = newBlue; // Blueish
            imgOut.pixels[index + 3] = 255; // Alpha

        }
    }
    imgOut.updatePixels();
    return imgOut;
}

// Create a vignette filter
function darkCorners(img) {
    // Create an empty image the same size as the original
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // Loop through every pixel
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {

            // Calculate the 1D location from a 2D grid
            var index = (x + y * img.width) * 4;

            // Get the R,G,B values from image
            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];

            // Calculate the distance from the center
            var distanceFromCenter = dist(x, y, img.width / 2, img.height / 2);

            // Calculate dynLum based on distance constraints
            var dynLum;
            if (distanceFromCenter <= 300) {
                dynLum = 1; // No adjustment
            } else if (distanceFromCenter > 300 && distanceFromCenter <= 450) {
                dynLum = map(distanceFromCenter, 300, 450, 1, 0.4);
            } else {
                dynLum = map(distanceFromCenter, 450, dist(0, 0, img.width / 2, img.height / 2), 0.4, 0);
            }       
            dynLum = constrain(dynLum, 0, 1);
            // Calculate newRed, newGreen, and newBlue
            newRed = oldRed * dynLum;
            newGreen = oldGreen * dynLum;
            newBlue = oldBlue * dynLum;

            // Set the pixel colors
            imgOut.pixels[index + 0] = newRed; // Reddish
            imgOut.pixels[index + 1] = newGreen; // Greenish
            imgOut.pixels[index + 2] = newBlue; // Blueish
            imgOut.pixels[index + 3] = 255; // Alpha
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

function blurFilter(img) {
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    const matrixSize = matrix.length;

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var index = (x + y * img.width) * 4;

            var c = convolution(x, y, matrix, matrixSize, imgIn);

            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

// 
function convolution(x, y, matrix, size, img) {
    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;
    var offset = Math.floor(size / 2);
    

    for (var i=0; i<size; i++) {
        for (var j=0; j<size; j++) {
            var xloc = x + i - offset;
            var yloc = y + j - offset;

            var index = (img.width * yloc + xloc) * 4;
            index = constrain(index, 0, img.pixels.length - 1);

            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }

    return [totalRed, totalGreen, totalBlue];
}


function radialBlurFilter(img) {
    var imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();
    const matrixSize = matrix.length;

    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            var index = (x + y * img.width) * 4;

            // Calculate the distance from the mouse
            var distanceFromMouse = dist(mouseX, mouseY, img.width + x, y);

            // Remap the distance to get the dynBlur value
            var dynBlur;
            
            if (distanceFromMouse < 100) {
                dynBlur = 0; // Complete Blur
            } else if (distanceFromMouse >= 100 && distanceFromMouse <= 300) {
                dynBlur = map(distanceFromMouse, 100, 300, 0, 1);
            } else {
                dynBlur = 1;
            }       

            dynBlur = constrain(dynBlur, 0, 1);

            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];

            var c = convolution(x, y, matrix, matrixSize, imgIn);

            // Update the pixel values
            imgOut.pixels[index + 0] = c[0]*dynBlur + r*(1-dynBlur);
            imgOut.pixels[index + 1] = c[1]*dynBlur + g*(1-dynBlur);
            imgOut.pixels[index + 2] = c[2]*dynBlur + b*(1-dynBlur);
            imgOut.pixels[index + 3] = 255;

        }
    }
    imgOut.updatePixels();
    return imgOut;
}


function borderFilter(img) {
    // Create a graphics buffer the same size as the image
    var buffer = createGraphics(img.width, img.height);

    // Draw the original image onto the buffer
    buffer.image(img, 0, 0);

    // Settings for the border
    buffer.stroke(255);  // White color
    buffer.strokeWeight(20);  // Thickness of the border
    buffer.noFill();

    // Draw rounded rectangle
    buffer.rect(10, 10, img.width - 20, img.height - 20, 40);

    // Draw non rounded rectangle to remove the black triangle corners
    buffer.rect(10, 10, img.width - 20, img.height - 20);

    // Return the buffer
    return buffer;
}