

var local_user = " user";
var server_user = " otheruser";


$(document).ready(function () {

    //$('#application').hide();
   // $('#login_div').hide();

    var chatto = 'room1';
    io.to('some room').emit('some event');


    // $("#user_btn").click(function () {

    //     $('#application').show();
    //     $('#login_div').hide();
    //     chatto = $('#User_name').val();
    // });

    // $("#room_selector").click(function () {
    //     // alert($('.options').val());
    //     chatto = $('#User_name').val();
    // });



    const port = "ws://localhost:8000";
    const socket = io(port);

    // setInterval(() => {
    //     socket.emit('load_contact', socket.id);
    // }, 3000);


    socket.on('connect', () => {
        console.log(socket.id); // 'G5p5...'
        socket.emit('load_contact', socket.id);
        $("#p").append(socket.id);
    });


    socket.on('msg', text => {
        get_msg(text, server_user);
        console.log(text);
    })

    socket.on('load_contact', (arr) => {
        //console.log(arr);
        // var arr=text.split(',');
        $('.contacts_container').empty();

        for (var i = 0; i < arr.length; i++) {
            if (arr[i] != socket.id) {
                $('.contacts_container').append(`<div class="contact">${arr[i]}</div>`);
            }
        }

    })





    // socket.on('private_message', text => {
    //     get_msg(text, server_user);
    //     console.log(text);
    // })

    const container = $('#contain');
    const msg = $('#msgContainer');

    var msg_div = ''

    $("#enter").click(function () {
        if (msg.val().trim() != '') {



            socket.emit('msg', msg.val());
            get_msg(msg.val(), local_user);
        }
    });



    $(document).on('keypress', function (e) {

        // if (e.which === 13 && e.shiftKey) {
        //     e.preventDefault();
        //     msg.val(msg.val() + "\n");
        //     return;
        // }



        if (e.which == 13) {
            if (msg.val().trim() != '') {
                socket.emit('msg', msg.val());

                // var privat = {
                //     anotherSocketId: chatto,
                //     msg: msg.val()
                // };
                //socket.emit('private_message',privat );
                get_msg(msg.val(), local_user);

            }
        } else {
            msg.focus();
        }
    });
    function get_msg(io_msg, origin) {

        console.log(origin);

        var message = io_msg || msg.val();

        var cllass = "msg white";

        // var x = Math.random() * 2;

        // if (x < 1) {
        //     cllass = cllass + " user";
        // } else {
        //     cllass = cllass + " otheruser";
        // }

        cllass = cllass + " " + origin;

        container.append(insert(cllass, message));


        $('.table_container').scrollTop($('.main_div').height());


        msg.val("");
    }

    function insert(className, content) {

        var msg = content.msg || content;
        var user_id = content.id || "You";
        var tag = 'div';

        var text = `<${tag} class="${className}">${msg} <span>${user_id}</span>    </${tag}> `;



        if (className.indexOf('otheruser') == -1) {
            return " <tr>  <td> </td> <td>" + text + "</td>  </tr>";
        } else {
            return " <tr> <td>" + text + "</td> <td> </td> </tr>";
        }






    }

});

