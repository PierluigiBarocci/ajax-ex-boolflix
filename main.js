// Example api request

// https://api.themoviedb.org/3/movie/550?api_key=82d42d7ba19cc3f165f25f52f34da589

// creiamo una var d'appoggio per liberare un po' il campo
var api_themov = 'https://api.themoviedb.org/3/';
// e la classica per chiamare handlebars in aiuto
var template_html = $("#template").html();
var template_function = Handlebars.compile(template_html);
// Chiamata ajax statica per poi appendere un ul al container
$.ajax ({
    'url': api_themov + 'search/movie',
    // come visto stamattina, usiamo data per riordinare un po'il codice e rendere tutto più accessibile e leggibile;
    'data': {
        'api_key': '82d42d7ba19cc3f165f25f52f34da589',
        // è qui che dobbiamo intervenire per interagire con l'input, ma ci torneremo più tardi
        'query': 'ritorno al futuro',
        'language': 'it-IT'
    },
    'method': 'GET',
    'success': function(data){
        var movies = data.results;
        console.log(movies);
        for (var i = 0; i < movies.length; i++) {
            // intercettiamo ogni singolo film
            var film = movies[i];
            // e di esso ci servono Titolo, Titolo Originale, Lingua e Voto
            // per adesso creaimo un oggetto con le varibili che ci servono
            var object = {
                'title': film.title,
                'ori_title': film.original_title,
                'language': film.original_language,
                'vote': film.vote_count
            };
            // diamo l'oggeto alla funzione Handlebars
            var final = template_function(object);
            console.log(final);
            // lo appendiamo al container nel main
            $('.mainview.container').append(final);
        }
    },
    'error': function(){
        alert('error');
    }
});

// Cambiare il valore della query sfruttando il val al click del bottone
// aggiunger il click del tasto invio
