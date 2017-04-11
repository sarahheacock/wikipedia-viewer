
function getResults(input) {
  
  removeResults();
  
  var title = input.replace(" ", "%20");

  var nurl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + title + '&format=json';

  $.ajax( {
    url: nurl,
    dataType: 'jsonp',
    type: 'GET',
    headers: {'API-User-Agent': 'Example/1.0'},
    success: function(data) {
       // do something with data
      var newTitle = '';
      var newSnippet = '';
      var newlink = '';
      
      //iterates through search resutls
      for(var i = 0; i < 5; i++){

        newTitle = data["query"]["search"][i]["title"];
        newSnippet = data["query"]["search"][i]["snippet"];
        newlink = "https://en.wikipedia.org/wiki/" + newTitle.replace(" ", "%20");
        //sends the title, snippet, and link off to getImage
        getImage(newTitle, newSnippet, newlink);        
      } 
    }
  });
  
}

function getImage(title, snip, link){
  //https://en.wikipedia.org/w/api.php?action=query&titles=Albert%20Einstein&prop=images&format=json
  var defalt = '<div class="row" id="link"><a href="' + link + '"><p><img src="http://www.latascausa.com/site/wp-content/uploads/2013/10/Tile-Dark-Grey-Smaller-White-97.png"><h2>' + title + '</h2><h3>' + snip + '</h3></p></a></div>';
  
  var nrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + title + '&prop=images&imlimit=1&format=json';
  
  
  $.ajax( {
      url: nrl,
      dataType: 'jsonp',
      type: 'GET',
      success: function (data) {
        var file = JSON.stringify(data);
        var start = file.indexOf('File:');
        var end = file.indexOf('"}]}}}}');
    
        if(start !== -1){
      
          var newfile = file.slice(start, end);
          for (var i = 0; i < newfile.length; i++){
            if(newfile.charAt(i) === " "){
              newfile = newfile.replace(" ", "_");
            }
          }
        
    
          var nnrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + newfile + '&prop=imageinfo&iiprop=url&format=json'
          $.ajax( {
            url: nnrl,
            dataType: 'jsonp',
            type: 'GET',
            success: function (data) {
              var pic = JSON.stringify(data);
              var newstart = pic.indexOf('https://upload.wikimedia.org/wikipedia/commons/');
              var newend = pic.indexOf('","descri');
              pic = pic.slice(newstart, newend);
              
              //var y = '<img src="' + pic + '">';
              //console.log(y);
              if(pic === ""){
                //$("#results").prepend(defalt);
                write(defalt);
              }
              else {
              //$("#results").prepend('<div class="row link"><p><a href="' + link + '"><img src="' + pic + '"><h2>' + title + '</h2><h3>' + snip + '</h3></a></p></div>');
                write('<div class="row" id="link"><a href="' + link + '"><p><img src="' + pic + '"><h2>' + title + '</h2><h3>' + snip + '</h3></p></a></div>');
              }

              //add('#' + n, y);
            }
      
           });
        }
        else if (start === -1){
          //$("#results").prepend(defalt);
          write(defalt);
        }
      }
    });


}
    
// function add (id, s){
//   $(id).append(s);
// }
      







function write(s){
 //$(".link").fadeOut();
  $('#results').fadeOut(700, function(){
    //$('#author').text(a);
    //$('.link').remove();
    $("#results").prepend(s);
    $('#results').fadeIn(700);
  });
 //       $("#search").after('<div id="result"></div>');
}

function removeResults(){
  $('#results').fadeOut(700, function(){

    $('div#link').remove();
    //$("div#results").remove();
    //$("body").append('<div id="results"></div>');

  });
}

$(document).ready(function(){

  getResults('wikipedia');
  
  //everytime a letter is typed, previous string is removed and the new string is set to getResults
    $('input').on('keyup', function() {
      
        var look = $('input:text').val(); 
     if ($('input').val().length > 1) {
       // removeResults();
        getResults(look);
     }
     //  else {
     //   getResults('wikipedia');
     // }
     
      
    });
    
  // });
});