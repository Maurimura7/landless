//TODO:
//  Pasar valores INTENSIDAD entre [0-4]
var btn =  $(':button').on('click',function(){
    console.log('Boton');
    var sel = $(this);
    enviarControl({'id' : $(this).attr('id'), 'val' : sel.val()});
    });

var intens = $('#intensidad').on('focus change',function(){
    var sel = $(this);
    enviarControl({'id' : sel.attr('id'), 'val' : sel.val()});
});

//Objeto de propiedades
var propiedades = { 'ph' : 1,
                    'nutrientes' : {'N' : 20,
                                    'K' : 30,
                                    'P' : 22}

}
//Creador dinamico de CARDS.
var makeCard = function(prop){
    for(var key in prop){
        $('#infocards').append('<div class="card" id="card'+key+'">'
        +'<div class="card-main>"'
            +'<div class="card-inner">'
                +'<h3>'+key+'</h3>'
                +'<p>'+prop[key]+'</p>'
            +'</div>'
            +'<div class="card-action">'
            +'</div>'
        +'</tr>');
    }
}
makeCard(propiedades);
/*HTML de CARD
<div class="card">
    <div class="card-main">
        <div class="card-inner"> ... </div>
        <div class="card-action"> ... </div>
    </div>
</div>
*/
