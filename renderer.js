// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// filesystem api
var fs = require('fs');

// open file dialog
const { dialog } = require('electron').remote;

// properties reader api
var PropertiesReader = require('properties-reader');

// properties variable
var properties = PropertiesReader('config.properties');

// constant config key
var imageConfigKey = "main.image.path";

// scheduler
var updateScheduler;

// image path
var imagePath = "";

// Main on load function
window.onload = function () {
    if (imagePath || imagePath === "") {
        // dialog.showOpenDialog({
        //     properties: ['openFile']
        // }, function (filePath) {
        //     if (filePath !== undefined) {
        //         // handle file
        //         imagePath = filePath[0];
        //         updateImage1();
        //         startScheduler();
        //     }
        // });

        // handle file
        if(properties.get(imageConfigKey)) {
            imagePath = properties.get(imageConfigKey);
            updateImage();
            startScheduler();
        }
    }
}

// set scheduler for 5 secs
function startScheduler() {
    updateScheduler = setInterval(updateImage, 5000);
}

// update image function
function updateImage() {
    var failed = 0;

    // repeat until success
    do {
        fs.readFile(imagePath, function (err, data) {
            // on error retry after 500ms
            if (err) {
                failed = 1;
                console.log(err);
            }

            // set image on success
            var blob = new Blob([data], { type: 'image/jpg' });
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(blob);
            var image = document.getElementById("image1");
            image.src = imageUrl;
            failed = 0;
        });
    } while (failed === 1);

}