// http://cssdk.s3-website-us-east-1.amazonaws.com/sdk/2.1/docs/WebHelp/references/csawlib/com/adobe/premiere/ProjectItem.html
// https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/Premiere.jsx#L215

if (typeof($) == 'undefined') $ = {};

believetools = {
    
    say: function(something) {
        $.writeln(something); // output to ExtendScript Toolkit Console
        alert(something); // invoke a warning popup
        return "thanks"; // return a string back to JavaScript
    },

    traverse_project_items: function() {
        
        if (!app.project.rootItem) return "rootItem is not available";

        var file_paths = [];
        // breadth first traversal
        var stack  = [app.project.rootItem];
        while (stack.length > 0) {
            var item = stack.shift();
            if (item === undefined || item.children === undefined || item.children.numItems < 1) continue;
            var numChildren = item.children.numItems;
            for (var i = 0; i < numChildren; i++) {
                var child = item.children[i];
                switch (child.type) {
                    case ProjectItemType.CLIP:
                    case ProjectItemType.FILE:
                    
                    var file_path = child.getMediaPath();

                        $.writeln(file_path);
        
                        if (file_path && file_path.length > 0) {
                            file_paths.push('"'+encodeURIComponent(file_path)+'"');
                        }
                        // do something with the file_path
                        break;
                    // case ProjectItemType.BIN:
                    //     stack.push(child);
                    //     break;
                } // switch end
            }
        }
    
         $.writeln("   ");


        //var result = '['+file_paths.join(", ")+']';
        //return result;
        
    }
}


function searchForBinWithName(binName) {
    var numItemsAtRoot = app.project.rootItem.children.numItems;
    var foundBin = 0;
 
    for (var i = 0; i < numItemsAtRoot && foundBin == 0; i++) {
        var currentItem = app.project.rootItem.children[i];
 
        if (currentItem != null && currentItem.name == binName) {
            foundBin = currentItem;
        }
        $.writeln(foundBin);
    }
    return foundBin;
}

var sequence = app.project.activeSequence;
// $.writeln(sequence.name);
// $.writeln(sequence.videoTracks.numTracks);

var binToFind = "_tomasActualizadas"


var targetBin = searchForBinWithName(binToFind);
if (targetBin == 0){
    targetBin = app.project.rootItem.createBin(binToFind);
}
// iterate TrackCollection (videoTracks)
for (var i=0; i<sequence.videoTracks.numTracks; i++ ){
    
    // track number/id
    // $.writeln("track: " + sequence.videoTracks[i].id);
    
    // track media type
    // $.writeln(sequence.videoTracks[i].mediaType);    

    for (var tracknum=0; tracknum<sequence.videoTracks[i].clips.numTracks; tracknum++ ){
        
        var aClip = sequence.videoTracks[i].clips[tracknum].projectItem

        $.writeln(aClip.name);    
        
        var clippath = aClip.getMediaPath();
        var patharray = clippath.split('/')
        
        // get path of assets for the shot
        var filename = patharray.slice((patharray.length - 1), (patharray.length)).join("/")
        var extensionpos = filename.lastIndexOf(".")
        var fileextension = filename.slice(extensionpos, filename.length)
        var filenameSinExt = filename.slice(0,extensionpos)
        
        var assetName = filenameSinExt.slice(0, -5);
        $.writeln(assetName);
        
        var itemlen = filenameSinExt.split('_').length - 1;
        var versionPadding = filenameSinExt.length;
        var version = Number(filenameSinExt.split('_')[itemlen].slice(1));
        var assetsBasePath = patharray.slice(0,(patharray.length - 2)).join("/");
        // var shotassetdir = 
        $.writeln(assetsBasePath);

        // file name
        $.writeln(" ");    
        $.writeln("looking for latest version of: " + assetName);    
        $.writeln(" ");    
        
        var myFolder = new Folder(assetsBasePath);
        
        var versionInc = version
        var lastKnownVersion = version
        var possibleFile = clippath
        
        // loop until version reaches 1000
        while (versionInc < 1000){

            versionInc = versionInc + 1;
            var versionUp = assetName + "_v" + ("000"+versionInc).slice(-3);
            var possibleVersion = versionUp + fileextension
            testForPossibleFile = assetsBasePath + "/" + versionUp + "/" + possibleVersion

            var UpItem = File(testForPossibleFile);

            if (UpItem.exists){
                // $.writeln("exists:" + testForPossibleFile);
                lastKnownVersion = versionInc
                possibleFile = testForPossibleFile
            }

        }
        
        $.writeln("latest version: " + possibleFile);    
        $.writeln("\n\n");    
        
        var UpItem = File(possibleFile);
        var vidFiles = new Array;
        vidFiles.push(UpItem)
        var myFootage = app.project.importFiles(vidFiles, 1, targetBin, 0);


        // if (fileOrFilesToImport) {
        //     var nameToFind    = 'Tomas actualizadas';
        //     var targetBin    = $._PPP_.searchForBinWithName(nameToFind);
        //
        //     if (targetBin === 0) {
        //         // If panel can't find the target bin, it creates it.
        //         app.project.rootItem.createBin(nameToFind);
        //         targetBin    = $._PPP_.searchForBinWithName(nameToFind);
        //     }
        //
        //     if (targetBin) {
        //         targetBin.select();
        //         // We have an array of File objects; importFiles() takes an array of paths.
        //         var importThese = new Array();
        //
        //         if (importThese){
        //             for (var i = 0; i < fileOrFilesToImport.length; i++) {
        //                 importThese[i] = fileOrFilesToImport[i].fsName;
        //             }
        //             app.project.importFiles(importThese,
        //                                     1,                // suppress warnings
        //                                     targetBin,
        //                                     0);                // import as numbered stills
        //         }
        //     } else {
        //         alert("Could not find or create target bin.");
        //     }
        // }
        
        $.writeln("Latest version of: " + assetName + " : " + possibleFile);            

 
    }
}

// var numItems    = app.project.rootItem.children.numItems;
// var currentItem    = 0;
//
// for (var i = 0; i < numItems; i++){
//     currentItem = app.project.rootItem.children[i];
//     if (currentItem){
//         $.writeln(currentItem.canChangeMediaPath());
//     }
// }


// believetools.traverse_project_items()