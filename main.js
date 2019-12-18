
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

// when I go over the card
// I want to show off the properites of the movie
// I have to use on document for the template
$(document).on('mouseover', '.card', function(){
    $(this).find('.properties').fadeIn();
})
$(document).on('mouseleave', '.card', function(){
    $('.properties').fadeOut();
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
            // if there isn't a poster available, I get a standard Image
            var background = 'images/no_poster.jpg';
        } else {
            var background = 'https://image.tmdb.org/t/p/w342' + object.poster_path;
        };
        if (object.hasOwnProperty('title')) {
            var title = object.title;
        } else {
            var title = object.name;
        };
        if (object.hasOwnProperty('original_title')) {
            var original = object.original_title;
        } else {
            var original = object.original_name;
        };
        var id_movie = object.id;
        var array_attori = [];
        $.ajax ({
            'url': 'https://api.themoviedb.org/3/movie/' + id_movie + '/credits?api_key=82d42d7ba19cc3f165f25f52f34da589',
            'method': 'GET',
            'success': function(data){
                var attori = data.cast;
                for (var i = 0; i < 5; i++) {
                    var attore = attori[i];
                    var attore_nome = attore.name;
                    array_attori.push(attore_nome);
                };
                console.log(array_attori);
                var lista_attori = array_attori.join();
                console.log(lista_attori);
                var properties = {
                    'background': background,
                    'title': title,
                    'ori_title': original,
                    'language': flag_lang,
                    'vote': '<i class="fas fa-star"></i>'.repeat(stars_vote),
                    'no_vote': '<i class="far fa-star"></i>'.repeat(5 - stars_vote),
                    'overview': (object.overview).slice(0, 300) + '...',
                    'cast': lista_attori
                };
                var final = template_function(properties);
                $('.mainview.container').append(final);
                console.log(id_movie);
            },
            'error': function(){
                alert('error');
            }
        });
        // var properties = {
        //     'background': background,
        //     'title': title,
        //     'ori_title': original,
        //     'language': flag_lang,
        //     'vote': '<i class="fas fa-star"></i>'.repeat(stars_vote),
        //     'no_vote': '<i class="far fa-star"></i>'.repeat(5 - stars_vote),
        //     'overview': (object.overview).slice(0, 300) + '...',
        //     'cast': lista_attori
        // };
        // var final = template_function(properties);
        // $('.mainview.container').append(final);
        // console.log(id_movie);
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
