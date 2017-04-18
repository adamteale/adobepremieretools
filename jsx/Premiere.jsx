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
        $.writeln(sequence.videoTracks[i].clips[tracknum].projectItem.name);    
        $.writeln(sequence.videoTracks[i].clips[tracknum].projectItem.getMediaPath());    
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