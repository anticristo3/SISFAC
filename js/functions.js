$(document).ready(function(){

    //--------------------- SELECCIONAR FOTO PRODUCTO ---------------------
    $("#foto").on("change",function(){
    	var uploadFoto = document.getElementById("foto").value;
        var foto       = document.getElementById("foto").files;
        var nav = window.URL || window.webkitURL;
        var contactAlert = document.getElementById('form_alert');
        
            if(uploadFoto !='')
            {
                var type = foto[0].type;
                var name = foto[0].name;
                if(type != 'image/jpeg' && type != 'image/jpg' && type != 'image/png')
                {
                    contactAlert.innerHTML = '<p class="errorArchivo">El archivo no es válido.</p>';                        
                    $("#img").remove();
                    $(".delPhoto").addClass('notBlock');
                    $('#foto').val('');
                    return false;
                }else{  
                        contactAlert.innerHTML='';
                        $("#img").remove();
                        $(".delPhoto").removeClass('notBlock');
                        var objeto_url = nav.createObjectURL(this.files[0]);
                        $(".prevPhoto").append("<img id='img' src="+objeto_url+">");
                        $(".upimg label").remove();
                        
                    }
              }else{
              	alert("No selecciono foto");
                $("#img").remove();
              }              
    });

    $('.delPhoto').click(function(){
    	$('#foto').val('');
    	$(".delPhoto").addClass('notBlock');
    	$("#img").remove();

    });

    //Activa campos para registrar cleinte
    $('.btn_new_cliente').click(function(e){
        e.preventDefault();
        $('#nom_cliente').removeAttr('disable');
        $('#tel_cliente').removeAttr('disable');
        $('#dir_cliente').removeAttr('disable');

        $('#div_registro_cliente').slideDown();
    });

    //Facturar venta
    $('#btn_facturar_venta').click(function(e){
        e.preventDefault();

        var rows = $('#detalle_venta tr').length;
        if(rows > 0)
        {
            var action = 'procesarVenta';
            var codcliente = $('#idcliente').val();

            $.ajax({
                url: 'ajax.php',
                type: "POST",
                async: true,
                data: {action:action,codcliente:codcliente},

                success: function(response){
                    if(response != 'error')
                    {
                        var info = JSON.parse(response);
                        //console.log()info;
                        generarPDF(info.codcliente,info.nofactura)

                        location.reload();
                    }else{
                        console.log('no data');
                    }
                },
                error:function(error){

                }
            });
        }
    });

    //Buscar cliente
    $('#nit_cliente').keyup(function(e){
        e.preventDefault();

        var cl = $(this).val();
        var action = 'searchCliente';

        $.ajax({
            url: 'ajax.php',
            type: "POST",
            async : true,
            data: {action:action,cliente:cl},

            success: function(response){

                if(response == 0){
                    $('#idcliente').val('');
                    $('#nom_cliente').val('');
                    $('#tel_cliente').val('');
                    $('#dir_cliente').val('');
                    //Mostrar boton agregar
                    $('.btn_new_cliente').slideDown();
                }else{
                    var data = $.parseJSON();
                    $('#idcliente').val(data.idcliente);
                    $('#nom_cliente').val(data.nombre);
                    $('#tel_cliente').val(data.telefono);
                    $('#dir_cliente').val(data.direccion);
                    //Ocultar botón agregar
                    $('.btn_new_cliente').slideUp();
                    //Bloque campos
                    $('#nom_cliente').attr('disable','disable');
                    $('#tel_cliente').attr('disable','disable');
                    $('#dir_cliente').attr('disable','disable');
                    //Ocultar boton guardar
                    $('#div_registro_cliente').slideUp();
                }
            },
            erro: function(error){

            }
        });

    });

    //Crear Cliente -Ventas.
    $('#form_new_cliente_venta').submit(function(e){
        e.preventDefault();
        $.ajax({
            url: 'ajax.php',
            type: "POST",
            async : true,
            data:  $('#form_new_cliente_venta').serialize(),

            success: function(response){

                if(response != 'error'){
                    //Agregar id a input hiden
                    $('#idcliente').val(response);
                    //Bloques campos
                    $('#nom_cliente').attr('disable','disable');
                    $('#tel_cliente').attr('disable','disable');
                    $('#dir_cliente').attr('disable','disable');
                    //Ocultar boton Agregar
                    $('.btn_new_cliente').slideUp();
                    //Ocultar boton guardar
                    $('#div_registro_cliente').slideUp();

                }
            },
            erro: function(error){

            }
        });
    });


    $('.delPhoto').click(function(){
        $('#foto').val('');
        $('#delPhoto').addClass('notBlock');
        $('#img').remove();
    });

    //Modal Form Add Product
    $('.add_product').click(function(e){
        e.preventDefault();
        var producto = $(this).attr('product');
        var action = 'infoProducto';

        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            async: true,
            data: {action:action,producto:producto},

                success: function(response){
                    console.log(response);
                },

                error: function(error){
                    console.log(error);
                }
        });


        $('.modal').fadeIn();
    });

});//READY

function generarPDF(cliente,factura){
    var ancho = 1000;
    var alto = 800;
    //Calcular posición x,y para centrar la venta
    var x = parseInt((window.screen.width/2) - (ancho / 2));
    var y = parseInt((window.screen.height/2) - (alto / 2));

    $url = 'factura/generaFactura.php?cl='+cliente+'&f'+factura;
    window.open($url,"Factura","left="+x+",top="+y+",height="+alto+",width="+ancho+",scrollbar=si,location=no,resizable=si,menubar=no");
}

//function coloseModal(){
  //  $('.modal').fedeOut();
//}