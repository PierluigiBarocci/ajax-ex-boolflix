
//Click Search Icon
$('#search_icon').click(function(){
    // empting container
    $('#movie .card-wrapper').empty();
    $('#tv .card-wrapper').empty();
    $('#movie').removeClass('visible');
    $('#tv').removeClass('visible');
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
        $('#movie .card-wrapper').empty();
        $('#tv .card-wrapper').empty();
        $('#movie').removeClass('visible');
        $('#tv').removeClass('visible');
        var user_research = $('.searchbar > input').val();
        if (user_research.length < 3) {
            errorGenerator('Devi digitare almeno 3 caratteri...');
            $('.searchbar > input').val('');
        } else {
            mdbApiCall(user_research);
        };
    }
});
// Searching for All Genres of Movies and Tv Shows
var allApiMovieGen = [];
var allApiTvGen = [];
$.ajax({
    'url': 'https://api.themoviedb.org/3/genre/movie/list?api_key=82d42d7ba19cc3f165f25f52f34da589&language=it-IT',
    'method': 'GET',
    'success': function(data){
        for (var i = 0; i < (data.genres).length; i++) {
            allApiMovieGen.push(data.genres[i]);
            var objectList = '<option value="' + data.genres[i].name + '">' + data.genres[i].name + '</option>';
            $('#choice_genre_movies').append(objectList);
        }
    },
    'error': function(){
        alert('error');
    },
})
$.ajax({
    'url': 'https://api.themoviedb.org/3/genre/tv/list?api_key=82d42d7ba19cc3f165f25f52f34da589&language=it-IT',
    'method': 'GET',
    'success': function(data){
        for (var i = 0; i < (data.genres).length; i++) {
            allApiTvGen.push(data.genres[i]);
            var objectList = '<option value="' + data.genres[i].name + '">' + data.genres[i].name + '</option>';
            $('#choice_genre_tv').append(objectList);
        }
    },
    'error': function(){
        alert('error');
    },
})

// when I go over the card
// I want to show off the properites of the movie
// I have to use on document for the template
$(document).on('mouseover', '.card', function(){
    $(this).find('.properties').fadeIn();
})
$(document).on('mouseleave', '.card', function(){
    $('.properties').fadeOut();
});

// Change of value for the vote
$('#choice_genre_tv').change(function(){
    // the value of the select
    var valore = $(this).val();
    // if No Value
    if (valore == '') {
        // show off all the cards
        $('#tv .card-wrapper .card').fadeIn();
    } else{
        // select each card
        $('#tv .card-wrapper .card').each(function(){
            // get the attribute data-voto
            var data_oggetto_corrente = $(this).attr('data-generi');
            // if they are equal
            if ((data_oggetto_corrente.toLowerCase()).includes(valore.toLowerCase())) {
                // show off this card
                $(this).fadeIn();
            } else {
                // else, hide this
                $(this).fadeOut();
            }
        });
    };
});
// the same, but for the genres
$('#choice_genre_movies').change(function(){
    // the value of the select
    var valore = $(this).val();
    // if No Value
    if (valore == '') {
        // show off all the cards
        $('#movie .card-wrapper .card').fadeIn();
    } else{
        // select each card
        $('#movie .card-wrapper .card').each(function(){
            // get the attribute data-voto
            var data_oggetto_corrente = $(this).attr('data-generi');
            // if they are equal
            if ((data_oggetto_corrente.toLowerCase()).includes(valore.toLowerCase())) {
                // show off this card
                $(this).fadeIn();
            } else {
                // else, hide this
                $(this).fadeOut();
            }
        });
    };
});

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
            if (movies.length > 0) {
                // ciclying the array of movies
                for (var i = 0; i < movies.length; i++) {
                    var film = movies[i];
                    cardGenerator(film);
                };
            }
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
            console.log(movies);
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
            // if there isn't a poster available, I get a standard Image
            var background = 'images/no_poster.jpg';
        } else {
            var background = 'https://image.tmdb.org/t/p/w342' + object.poster_path;
        };
        if (object.hasOwnProperty('title')) {
            var title = object.title;
            var original = object.original_title;
            var type = '/movie/';
        } else {
            var title = object.name;
            var original = object.original_name;
            var type = '/tv/';
        };
        var generi = object.genre_ids;
        var fliying_genere = [];
        if (type == '/movie/' ) {
            for (var i = 0; i < allApiMovieGen.length; i++) {
                var current_id = allApiMovieGen[i].id;
                if (generi.includes(current_id)) {
                    var current_name = allApiMovieGen[i].name;
                    fliying_genere.push(current_name);
                }
            }
        } else {
            for (var i = 0; i < allApiTvGen.length; i++) {
                var current_id = allApiTvGen[i].id;
                if (generi.includes(current_id)) {
                    var current_name = allApiTvGen[i].name;
                    fliying_genere.push(current_name);
                }
            }
        }
        var id_movie = object.id;
        var array_attori = [];
        $.ajax ({
            'url': 'https://api.themoviedb.org/3' + type + id_movie + '/credits?api_key=82d42d7ba19cc3f165f25f52f34da589',
            'method': 'GET',
            'success': function(data){
                if ((data.cast).length != 0) {
                    var attori = data.cast;
                    for (var i = 0; i < attori.length; i++) {
                        var attore = attori[i];
                        var attore_nome = attore.name;
                        array_attori.push(attore_nome);
                    };
                    var max5Actors = array_attori.slice(0, 5);
                    var lista_attori = max5Actors.join();
                } else {
                    var lista_attori = 'Cast not available';
                }
                var stringa_generi = '';
                var data_generi = fliying_genere.join(' ');
                for (var i = 0; i < fliying_genere.length; i++) {
                    var stringa_generi = stringa_generi + '<strong>Genere ' + (i + 1) + ':</strong> ' + fliying_genere[i] + ', ' + '<br/>';
                }
                var final_genere = stringa_generi.slice(0, (stringa_generi.length - 7));
                var properties = {
                    'background': background,
                    'title': title,
                    'ori_title': original,
                    'language': flag_lang,
                    'vote_number': stars_vote,
                    'vote': '<i class="fas fa-star"></i>'.repeat(stars_vote),
                    'no_vote': '<i class="far fa-star"></i>'.repeat(5 - stars_vote),
                    'overview': object.overview,
                    'cast': lista_attori,
                    'generi': final_genere,
                    'data': data_generi
                };
                var final = template_function(properties);
                if (type == '/movie/') {
                    $('#movie').find('.card-wrapper').append(final);
                    $('#movie').addClass('visible');
                } else {
                    $('#tv').find('.card-wrapper').append(final);
                    $('#tv').addClass('visible');
                }
            },
            'error': function(){
                alert('error');
            }
        });
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
