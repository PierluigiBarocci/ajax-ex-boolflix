// Example api request

// https://api.themoviedb.org/3/movie/550?api_key=82d42d7ba19cc3f165f25f52f34da589

// creiamo una var d'appoggio per liberare un po' il campo
var api_themov = 'https://api.themoviedb.org/3/';
// e la classica per chiamare handlebars in aiuto
var template_html = $("#template").html();
var template_function = Handlebars.compile(template_html);
// Chiamata ajax statica per poi appendere un ul al container


// Cambiare il valore della query sfruttando il val al click del bottone
// dobbiamo intercettare il click sull'icona
$('#search_icon').click(function(){
    // come prima cosa bisogna svuotare il container, altrimenti si accavallano ricerche su ricerche
    $('.mainview.container').find('ul').remove();
    //prendere il valore dell'input,
    var user_research = $('.searchbar > input').val();
    // dobbiamo darlo alla query della chiamata ajax
    // ma prima che parta la chiamata ajax, se il valore è nullo, blocchiamo subito
    if (user_research.length < 3) {
        alert('Mi dispiace, ma per iniziare la ricerca servono almeno 3 caratteri');
    } else {

    };


})
// aggiunger il click del tasto invio


// FUNCTIONS

function myCalling() {
    $.ajax ({
        'url': api_themov + 'search/movie',

        'data': {
            'api_key': '82d42d7ba19cc3f165f25f52f34da589',
            'query': user_research,
            'language': 'it-IT'
        },
        'method': 'GET',
        'success': function(data){
            var movies = data.results;
            if (movies.length == 0) {
                alert('Mi dispiace, non ho trovato niente, riprova');
            } else {
                for (var i = 0; i < movies.length; i++) {
                    var film = movies[i];
                    var object = {
                        'title': film.title,
                        'ori_title': film.original_title,
                        'language': film.original_language,
                        'vote': film.vote_average
                    };
                    var final = template_function(object);
                    $('.mainview.container').append(final);
                }
            };
            $('.searchbar > input').val('');
        },
        'error': function(){
            alert('error');
        }
    });
};
