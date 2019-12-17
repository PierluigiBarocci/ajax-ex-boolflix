// Milestone 1:
// Creare un layout base con una searchbar (una input e un button) in cui possiamo
// scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
// bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
// film trovato:
// 1. Titolo
// 2. Titolo Originale
// 3. Lingua
// 4. Voto

//Click Search Icon
$('#search_icon').click(function(){
    // empting container
    $('.mainview.container').empty();
    // input value
    var user_research = $('.searchbar > input').val();
    // condition user value
    if (user_research.length < 3) {
        errorGenerator('Devi digitare almeno 3 caratteri...');
        $('.searchbar > input').val('');
    } else {
        mdbApiCall(user_research);
    };
})
//Click Enter
$('.searchbar > input').keypress(function(event){
    if (event.which == 13) {
        $('.mainview.container').empty();
        var user_research = $('.searchbar > input').val();
        if (user_research.length < 3) {
            errorGenerator('Devi digitare almeno 3 caratteri...');
            $('.searchbar > input').val('');
        } else {
            mdbApiCall(user_research);
        };
    }
});

// Milestone 2:
// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
// permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
// lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
// piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della
// nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
// nazione ritornata dall’API (le flag non ci sono in FontAwesome).

// star :
// <i class="fas fa-star"></i>
// empty star:
// <i class="far fa-star"></i>

// Math.ceil(4,1) --> expected result: 5;
// var prov_vote = (object.vote_average / 2);
// var stars_vote = Math.ceil(prov_vote);





// FUNCTIONS

function mdbApiCall(choice) {
    // calling for films
    $.ajax ({
        'url': 'https://api.themoviedb.org/3/search/movie/',
        'data': {
            'api_key': '82d42d7ba19cc3f165f25f52f34da589',
            'query': choice,
            'language': 'it-IT'
        },
        'method': 'GET',
        'success': function(data){
            var movies = data.results;
            // ciclying the array of movies
            for (var i = 0; i < movies.length; i++) {
                var film = movies[i];
                cardGenerator(film);
            };
            // empting searchbar
            $('.searchbar > input').val('');
        },
        'error': function(){
            alert('error');
        }
    });
    // calling for series
    $.ajax ({
        'url': 'https://api.themoviedb.org/3/search/tv/',
        'data': {
            'api_key': '82d42d7ba19cc3f165f25f52f34da589',
            'query': choice,
            'language': 'it-IT'
        },
        'method': 'GET',
        'success': function(data){
            var movies = data.results;
            // ciclying the array of movies
            for (var i = 0; i < movies.length; i++) {
                var film = movies[i];
                cardGenerator(film);
            };
            // empting searchbar
            $('.searchbar > input').val('');
        },
        'error': function(){
            alert('error');
        }
    });
};

function cardGenerator(object) {
    // generating a kind of card with the datas of the single movie
        var template_html = $("#template").html();
        var template_function = Handlebars.compile(template_html);
        // var for the stars vote
        var stars_vote = (Math.ceil((object.vote_average / 2)));
        var lang = object.original_language;
        // switch case for the languages flags
        var flag_lang = '';
        switch (lang) {
            case 'en' : {
                flag_lang = '<img class="flag" src="images/en.ico" alt="lang">';
                break;
            }
            case 'fr' : {
                flag_lang = '<img class="flag" src="images/fr.ico" alt="lang">';
                break;
            }
            case 'it' : {
                flag_lang = '<img class="flag" src="images/it.ico" alt="lang">';
                break;
            }
            case 'es' : {
                flag_lang = '<img class="flag" src="images/sp.ico" alt="lang">';
                break;
            }
            case 'de' : {
                flag_lang = '<img class="flag" src="images/de.ico" alt="lang">';
                break;
            }
            default: {
                flag_lang = lang;
            }
        };
        if (object.poster_path == null) {
            var properties = {
                'background': 'images/no_poster.jpg',
                'title': object.name || object.title,
                'ori_title': object.original_name || object.original_title,
                'language': flag_lang,
                'vote': '<i class="fas fa-star"></i>'.repeat(stars_vote),
                'no_vote': '<i class="far fa-star"></i>'.repeat(5 - stars_vote),
            };
        } else{
            var properties = {
                'background': 'https://image.tmdb.org/t/p/w342' + object.poster_path,
                'title': object.name || object.title,
                'ori_title': object.original_name || object.original_title,
                'language': flag_lang,
                'vote': '<i class="fas fa-star"></i>'.repeat(stars_vote),
                'no_vote': '<i class="far fa-star"></i>'.repeat(5 - stars_vote),
            };
        } 
        var final = template_function(properties);
        $('.mainview.container').append(final);
}

function errorGenerator(type) {
    var template_html = $("#template-error").html();
    var template_function = Handlebars.compile(template_html);
    var properties = {
        'title': 'Ops',
        'type_of_error': type,
    };
    var final = template_function(properties);
    $('.mainview.container').append(final);
}
