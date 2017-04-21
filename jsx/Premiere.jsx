// http://cssdk.s3-website-us-east-1.amazonaws.com/sdk/2.1/docs/WebHelp/references/csawlib/com/adobe/premiere/ProjectItem.html
// https://github.com/Adobe-CEP/Samples/blob/master/PProPanel/jsx/Premiere.jsx#L215


    
    
    
    
    
if (typeof($) == 'undefined') $ = {};

$._ImportUpdateShots = {
    

    searchForBinWithName: function(binName) {
        var numItemsAtRoot = app.project.rootItem.children.numItems;
        var foundBin = 0;
 
        for (var i = 0; i < numItemsAtRoot && foundBin == 0; i++) {
            var currentItem = app.project.rootItem.children[i];
 
            if (currentItem != null && currentItem.name == binName) {
                $.writeln("----- " + currentItem.name);
                foundBin = currentItem;
            }

        }
        return foundBin;
    },


    searchBinForProjItemByName: function(i, currentItem, nameToFind){
        
        $.writeln("--- SEARCH FOR: " + nameToFind);
        $.writeln("--- SEARCHING IN: " + currentItem.name);
        $.writeln("--- ITEM COUNT: " + currentItem.children.numItems);
        $.writeln("--- i: " + i);
        var match = false;
        for (var j = i; j < currentItem.children.numItems; j++){
            var currentChild = currentItem.children[j];
            if (currentChild){
                $.writeln("CurrentItem: " + currentChild.name);        
                $.writeln("NameToMatch: " + nameToFind);        
                if (currentChild.type == ProjectItemType.BIN){
                    return $._ImportUpdateShots.searchBinForProjItemByName(0, currentChild, nameToFind);        // warning; recursion!
                } else {
                     if (currentChild.name == nameToFind){
                        $.writeln("_____________________MATCH!");       
                        match = true;
                     }
                }
            }
        }

        return match;
    },
    
    say: function(something) {
        $.writeln(something); // output to ExtendScript Toolkit Console
        alert(something); // invoke a warning popup
        return "thanks"; // return a string back to JavaScript
    },

    getUpdatedAssets: function() {
        
        if (!app.project.rootItem) return "rootItem is not available";



        var sequence = app.project.activeSequence;
        // $.writeln(sequence.name);
        // $.writeln(sequence.videoTracks.numTracks);

        var binToFind = "_tomasActualizadas"


        var targetBin = $._ImportUpdateShots.searchForBinWithName(binToFind);
        if (targetBin == 0){
            targetBin = app.project.rootItem.createBin(binToFind);
        }
        // iterate TrackCollection (videoTracks)
        
        var vidFilesToImport = new Array;
        
        for (var i=0; i<sequence.videoTracks.numTracks; i++ ){
    
            // track number/id
            // $.writeln("track: " + sequence.videoTracks[i].id);
    
            // track media type
            // $.writeln(sequence.videoTracks[i].mediaType);    

            for (var tracknum=0; tracknum<sequence.videoTracks[i].clips.numTracks; tracknum++ ){
        
                var aClip = sequence.videoTracks[i].clips[tracknum].projectItem

                $.writeln(aClip.name);    
        
                var clippath = escape(aClip.getMediaPath());

                // clippath = clippath.replace(" ","\ ");
                
                if( clippath.indexOf('asset/comp') >= 0){
        
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
                    var testingName = filename
                    // loop until version reaches 1000
                    while (versionInc < 1000){

                        versionInc = versionInc + 1;
                        var versionUp = assetName + "_v" + ("000"+versionInc).slice(-3);
                        var possibleVersion = versionUp + fileextension
                        testForPossibleFile = assetsBasePath + "/" + versionUp + "/" + possibleVersion

                        var UpItem = File(testForPossibleFile);

                        if (UpItem.exists){
                            $.writeln("exists:" + testForPossibleFile);
                            lastKnownVersion = versionInc;
                            testingName = possibleVersion;
                            possibleFile = testForPossibleFile;
                        }

                    }
        
                    $.writeln("latest version: " + possibleFile);    
 
        
        
                    var testIfImported = $._ImportUpdateShots.searchBinForProjItemByName(0, app.project.rootItem, testingName);
                    $.writeln("check if should import: " + testIfImported);    

                    if (testIfImported === false ){
                        $.writeln("SHOULD IMPORT");               
                        var UpItem = File(possibleFile);
                        vidFilesToImport.push(UpItem)
            
                    }else{
                        $.writeln("SHOULD IMPORT NOT");               
            
                    }
        

                    $.writeln("Latest version of: " + assetName + " : " + possibleFile);            

                }
            }
        }

        var myFootage = app.project.importFiles(vidFilesToImport, 1, targetBin, 0);

        // var file_paths = [];
        // // breadth first traversal
        // var stack  = [app.project.rootItem];
        // while (stack.length > 0) {
        //     var item = stack.shift();
        //     if (item === undefined || item.children === undefined || item.children.numItems < 1) continue;
        //     var numChildren = item.children.numItems;
        //     for (var i = 0; i < numChildren; i++) {
        //         var child = item.children[i];
        //         switch (child.type) {
        //             case ProjectItemType.CLIP:
        //             case ProjectItemType.FILE:
        //
        //             var file_path = child.getMediaPath();
        //
        //                 $.writeln(file_path);
        //
        //                 if (file_path && file_path.length > 0) {
        //                     file_paths.push('"'+encodeURIComponent(file_path)+'"');
        //                 }
        //                 // do something with the file_path
        //                 break;
        //             // case ProjectItemType.BIN:
        //             //     stack.push(child);
        //             //     break;
        //         } // switch end
        //     }
        // }
        //
        //  $.writeln("   ");
        //
        //
        // //var result = '['+file_paths.join(", ")+']';
        // //return result;
        
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