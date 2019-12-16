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
        myCalling(user_research);
    };
})
// al click del tasto invio
$('.searchbar > input').keypress(function(event){
    if (event.which == 13) {
        $('.mainview.container').find('ul').remove();
        var user_research = $('.searchbar > input').val();
        if (user_research.length < 3) {
            alert('Mi dispiace, ma per iniziare la ricerca servono almeno 3 caratteri');
        } else {
            myCalling(user_research);
        };
    }
});

// FUNCTIONS

function myCalling(choice) {
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
            if (movies.length == 0) {
                alert('Mi dispiace, non ho trovato niente, riprova');
            } else {
                for (var i = 0; i < movies.length; i++) {
                    var film = movies[i];
                    myGenerating(film);
                };
            };
            $('.searchbar > input').val('');
        },
        'error': function(){
            alert('error');
        }
    });
};

function myGenerating(object) {
        var template_html = $("#template").html();
        var template_function = Handlebars.compile(template_html);
        var properties = {
            'title': object.title,
            'ori_title': object.original_title,
            'language': object.original_language,
            'vote': object.vote_average
        };
        var final = template_function(properties);
        $('.mainview.container').append(final);
}
