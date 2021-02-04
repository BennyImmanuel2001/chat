

$(document).ready(function () {


    const port = "ws://localhost:8000";

    const socket = io(port);
    socket.on('mic_rec', chunks => {
        var clipContainer = document.createElement('article');
        var clipLabel = document.createElement('p');
        var audio = document.createElement('audio');
        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        audio.classList.add("micOtheruser");
        clipLabel.innerHTML = Math.random() * 2;
        clipContainer.append(audio);
        clipContainer.append(clipLabel);

        audio.controls = true;
        var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
        var audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;

        var rowCount = $('#contain tr').length;

        $('#contain').append(`<tr>  <td id='td_mic_${rowCount}'></td> <td> </td>  </tr>`);

        $(`#td_mic_${rowCount}`).append(audio);
        $('.table_container').scrollTop($('.main_div').height());
        // socket.emit('mic_rec',blob);
        // send_rec("otheruser","micUser");
    })













    var deleteButton = $('#deleteButton');

    var record = $('#mic');
    var soundClips = $('#sooo');

    function send_rec(origin, class_name) {
        var clipContainer = document.createElement('article');
        var clipLabel = document.createElement('p');
        var audio = document.createElement('audio');
        clipContainer.classList.add('clip');
        audio.setAttribute('controls', '');
        audio.classList.add(class_name);
        clipLabel.innerHTML = Math.random() * 2;
        clipContainer.append(audio);
        clipContainer.append(clipLabel);

        audio.controls = true;
        var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });

        var audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;
        console.log("recorder stopped");
        var rowCount = $('#contain tr').length;
        if (origin == 'user') {
            $('#contain').append(`<tr>  <td> </td> <td id='td_mic_${rowCount}'></td>  </tr>`);
        } else {
            $('#contain').append(`<tr>  <td id='td_mic_${rowCount}'></td> <td> </td>  </tr>`);
        }
        $(`#td_mic_${rowCount}`).append(audio);

        socket.emit('mic_rec', chunks);
        chunks = [];

    }


    if (navigator.mediaDevices) {
        console.log('getUserMedia supported.');

        var constraints = { audio: true };
        var chunks = [];

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {

                var mediaRecorder = new MediaRecorder(stream);
                // visualize(stream);

                record.click(function () {

                    if (record.hasClass("not_recording")) {
                        mediaRecorder.start();
                        console.log(mediaRecorder.state);
                        console.log("recorder started");
                        record.removeClass('not_recording').addClass('recording');

                    } else {
                        mediaRecorder.stop();
                        console.log(mediaRecorder.state);
                        console.log("recorder stopped");
                        record.removeClass('recording').addClass('not_recording');


                    }
                });



                mediaRecorder.onstop = function (e) {
                    //micOtheruser
                    //micUser
                    send_rec('user', 'micUser');
                    $('.table_container').scrollTop($('.main_div').height());

                }

                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                }
            })
            .catch(function (err) {
                console.log('The following error occurred: ' + err);
            })
    }




    //////////////////////////////////////// image /////////////////////////////////////////

    socket.on('image_sent', baseStringFromServer => {
        
        var userClass ="otheruser";
        var rowCount = $('#contain tr').length;
        var img = `<img class='msg_img'  src='${baseStringFromServer}'/>`;
        var img_container = `<div class='msg_img_container ${userClass}'>  ${img}</div>`;
        if (userClass == 'user') {
            $('#contain').append(`<tr>  <td></td> <td> ${img_container} </td>  </tr>`);
        } else {
            $('#contain').append(`<tr>  <td>  ${img_container}  </td> <td> </td>  </tr>`);
        }
    });



    function appendToApplication(baseString) {
        var userClass =  "user";
        var rowCount = $('#contain tr').length;
        var img = `<img class='msg_img'  src='${baseString}'/>`;
        var img_container = `<div class='msg_img_container ${userClass}'>  ${img}</div>`;
        if (userClass == 'user') {
            $('#contain').append(`<tr>  <td></td> <td> ${img_container} </td>  </tr>`);
        } else {
            $('#contain').append(`<tr>  <td>  ${img_container}  </td> <td> </td>  </tr>`);
        }
        socket.emit('image_sent', baseString);

    }

    function convertToString() {

        if (this.files && this.files[0]) {

            var FR = new FileReader();

            FR.addEventListener("load", function (e) {
                //   var baseString=e.target.result;
                appendToApplication(e.target.result);

            });

            FR.readAsDataURL(this.files[0]);
        }

    }

    document.getElementById("image_sender").addEventListener("change", convertToString);







});