/*function write() {
	let lyrics = $("#lyrics").val();
	console.log(lyrics);
}*/

//$(window).on("load", write)

//let re = /[^a-zA-Z0-9'’]*/;
//let re = /[\s\n]*/;

//let wordArray = lyrics.replace(/[\n\s]/, "~");
//wordArray = lyrics.replace(/[^a-zA-Z0-9'’~]/, "");
//wordArray = wordArray.split("~");

$("#lyrics").on("keypress", function() {
  let lyrics = $("#lyrics").val();

  let spaces = /[\s\n]/;
  let words = /^[a-zA-Z0-9'‘’!]+$/;
  let endPunct = /[a-zA-Z0-9'‘’!]+[^a-zA-Z0-9'‘’!]$/;
  let startPunct = /^[^a-zA-Z0-9'‘’!][a-zA-Z0-9'‘’!]+/;
  let punct = /[^a-zA-Z0-9'‘’!]/;

  let wordArray = lyrics.split(spaces);
  let newWordArray = [];

  wordArray.forEach(word => {
    if (words.test(word)) {
      newWordArray.push(word);
      //console.log(word);
    } else if (startPunct.test(word) || endPunct.test(word)) {
      word = word.replace(punct, "");
      newWordArray.push(word);
      console.log(word);
    } else {
      //Pass.
    }
  })

  let markup = newWordArray.map(word => "{" + word + "}");
  $("#markup").html(markup);
});
