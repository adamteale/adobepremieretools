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


var sequence = app.project.activeSequence;
// $.writeln(sequence.name);
// $.writeln(sequence.videoTracks.numTracks);


// iterate TrackCollection (videoTracks)
for (var i=0; i<sequence.videoTracks.numTracks; i++ ){
    
    $.writeln("track: " + sequence.videoTracks[i].id);
    
    
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
        var itemlen = filenameSinExt.split('_').length - 1
        var versionPadding = filenameSinExt.length
        var version = Number(filenameSinExt.split('_')[itemlen].slice(1))
        

        $.writeln(version);            
        $.writeln();


        var basepath = patharray.slice(0,(patharray.length - 2)).join("/")
        $.writeln(basepath);    

        // file name
        $.writeln(patharray[patharray.length - 1]);    
        
        var myFolder = new Folder(basepath);
        
        if (myFolder.exists){
          $.writeln("exists " + basepath );    
        }else{
            $.writeln("doesn't exist " + basepath );    
        }
        
        
        // check for higher version
         var UpItem = File.(aClip.MediaPath.slice(0,(lastIndex+1))+(escape(extension)+1) + ".mov");
        $.writeln(UpItem );    
 
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