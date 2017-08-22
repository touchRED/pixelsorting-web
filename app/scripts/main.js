var gui = new dat.GUI();

var sortedImg;
var sorted = false;
var original;
var pix = [];

function Controls(){
	this.imageURL = "";
	this.imageName = "";
	this.Upload = function(){
		document.querySelector('input[type=file]').click();
	}
	this.Create = function(){
		var self = this;
		loadImage(this.imageURL, function(img){

			// original = img;
			// image(img, 50, 0, 150, (150 * img.height)/img.width);

			sortNoWorker(img);
		});
	}
	this.Save = function(){
		sortedImg.save("sorted", "png");
	}
}

var ctrl = new Controls();
var create = gui.addFolder("Create");
// create.add(ctrl, 'imageName').listen();
create.add(ctrl, 'Upload');
create.add(ctrl, 'Create');
create.add(ctrl, 'Save');

function uploadImg(){
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.onload = function(event) {
		ctrl.imageURL = event.target.result;
		ctrl.imageName = file.name;
		loadImage(ctrl.imageURL, function(img){
			original = img;
		});
	}

	reader.readAsDataURL(file);
}

function sorter(a, b){
	return ((a.levels[3] << 24) + (a.levels[0] << 16) + (a.levels[1] << 8) + a.levels[2]) - ((b.levels[3] << 24) + (b.levels[0] << 16) + (b.levels[1] << 8) + b.levels[2]);
}

function sortNoWorker(img){
	sortedImg = createImage(img.width, img.height);
	var tmp = [];

	img.loadPixels();
	for (var i = 0; i < 4*(img.width*img.height); i+=4){
		tmp.push(color(img.pixels[i], img.pixels[i+1], img.pixels[i+2], img.pixels[i+3]));
	}

	tmp.sort(sorter);

	sortedImg.loadPixels();
	var k = 0;
	for (var i = 0; i < 4*(img.width*img.height); i+=4){

		sortedImg.pixels[i] = red(tmp[k]);
		sortedImg.pixels[i + 1] = green(tmp[k]);
		sortedImg.pixels[i + 2] = blue(tmp[k]);
		sortedImg.pixels[i + 3] = alpha(tmp[k]);
		k++;
	}
	sortedImg.updatePixels();
	sorted = true;

	// original = sortedImg;

}

function preload(){

	original = createImage(5,5);

}

function setup(){

	createCanvas(windowWidth, windowHeight);

}

function draw(){
	clear();
	var padding;

	if(original.width > original.height){
		padding = (windowHeight - (windowWidth/2 * original.height / original.width)) / 2;

		image(original, 0, padding, windowWidth/2, (windowWidth/2 * original.height) / original.width);
	}else{
		padding = (windowWidth/2 - (windowHeight * original.width) / original.height) / 2;

		image(original, padding, 0, (windowHeight * original.width) / original.height, windowHeight);
	}

	if(sorted){
		if(sortedImg.width > sortedImg.height){
			padding = (windowHeight - (windowWidth/2 * sortedImg.height / sortedImg.width)) / 2;

			image(sortedImg, windowWidth/2, padding, windowWidth/2, (windowWidth/2 * sortedImg.height)/sortedImg.width);
		}else{
			padding = (windowWidth/2 - (windowHeight * sortedImg.width)/sortedImg.height) / 2;

			image(sortedImg, padding + windowWidth/2, 0, (windowHeight * sortedImg.width)/sortedImg.height, windowHeight);
		}
	}
}
