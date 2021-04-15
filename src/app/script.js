document.addEventListener("DOMContentLoaded", function () {

    fs = require('fs');

    //import * as fileSaver from 'file-saver';
    // import { saveAs } from 'file-saver';
    //var FileSaver = require('file-saver');

    const os = require('os');
    const path = require('path');
    const desktopDir = path.join(os.homedir(), "Desktop");
    console.log(desktopDir);


    /********************************************************/


    //navigator.mediaDevices.getUserMedia({ audio: true});
    // navigator.mediaDevices.getUserMedia({
    //     audio: true
    // })
    //     .then(function (stream) {
    //         console.log('You let me use your mic!');
    //         //document.location.reload();
    //         //alert("actualiser la page");
    //     })
    //     .catch(function (err) {
    //         console.log('No mic for you!');
    //         alert("vous devez autoriser l'acces au micro pour avoir le choix de la sortie audio, puis actualiser la page : F5 \n(ça fonctionne uniquement sur chrome)");
    //     });

    /********************** SELECTION SORTIE AUDIO **********************/

    var audioElement = document.querySelectorAll('audio');
    console.log(audioElement);
    console.log(audioElement.length);

    const audioOutputSelect = document.querySelector('select#audioOutput');
    const selectors = [audioOutputSelect];

    audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

    function gotDevices(deviceInfos) {
        // Handles being called several times to update labels. Preserve values.
        const values = selectors.map(select => select.value);
        selectors.forEach(select => {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
        });
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audiooutput') {
                option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
                audioOutputSelect.appendChild(option);
            }
            //                        else {
            //                            console.log('Some other kind of source/device: ', deviceInfo);
            //                        }
        }
        selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
                select.value = values[selectorIndex];
            }
        });
    }

    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    // Attach audio output device to video element using device/sink ID.
    function attachSinkId(element, sinkId) {
        if (typeof element.sinkId !== 'undefined') {
            element.setSinkId(sinkId)
                .then(() => {
                    console.log(`Success, audio output device attached: ${sinkId}`);
                })
                .catch(error => {
                    let errorMessage = error;
                    if (error.name === 'SecurityError') {
                        errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                    }
                    console.error(errorMessage);
                    // Jump back to first output device in the list as it's the default.
                    audioOutputSelect.selectedIndex = 0;
                });
        } else {
            console.warn('Browser does not support output device selection.');
        }
    }

    function changeAudioDestination() {
        const audioDestination = audioOutputSelect.value;
        // attachSinkId(audioElement, audioDestination);
        for (let i = 0; i < audioElement.length; i++) {
            console.log("changeAudioDestination : ok");
            attachSinkId(audioElement[i], audioDestination);
        }
    }

    function handleError(error) {
        console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    audioOutputSelect.onchange = changeAudioDestination;


    /*************/

    /*********************************************************************************************/
    /*********************************************************************************************/
    var indexAudio = 0;

    // $("audio").each(function (index) {
    //     console.log("LA PARTIE DU CODE INUTILE");
    //     let timeRestElem = $('<p/>', {
    //         class: `timeRest`
    //     });
    //     timeRestElem.text("00:00");
    //     $(this).parent().append(timeRestElem);
    //     //                    $(this).attr('controls', '');
    //     this.setAttribute("controls", '');
    //     this.setAttribute("controlsList", 'nodownload');

    //     if ($(this).data("volume") != undefined)
    //         this.volume = $(this).data("volume");

    //     //                    console.log($(this).attr("autofadeout"));
    //     let check = false;
    //     if ($(this).attr("autofadeout") != undefined)
    //         check = true;

    //     $(this).parent().parent().append(`<div class="divOptions"> <button class="boutonFadeIn" data-duree="500">Fade In 0,5s</button>
    //                 <button class="boutonFadeOut" data-duree="500">Fade Out 0,5s</button> <button class="boutonVolumDef">Vol. par defaut</button> </div>`);
    //     $(this).parent().parent().children(".divOptions").append(`<button class="boutonFadeIn" data-duree="2000">Fade In 2s</button> <button class="boutonFadeOut" data-duree="2000">Fade Out 2s</button> `);
    //     $(this).parent().parent().append(` <p class="stateFade"> ––– </p> `);
    //     $(this).parent().parent().children(".divOptions").append(`<button class="boutonEnchaine" data-duree="2000">enchainé 2s</button> `);

    //     $(this).parent().parent().children(".divOptions").append(`<input title="auto Fade Out" id="${"autoFadeOut" + index}" class="checkboxAutoFadeOut" type="checkbox" ${check == true ? 'checked' : ''} > <label for="${"autoFadeOut" + index}" class="checkboxAutoFadeOutLabel">auto fade out</label> `);
    //     indexAudio = index;
    //     console.log("indexAudio= "+indexAudio);
    // });


    /******************************************* */

    $('.checkboxAutoFadeOut').change(checkboxAutoFadeOutChange);

    function checkboxAutoFadeOutChange() {
        //                    alert('changed');
        let audioEl = $(this).parent().parent().children('.playeur').children('audio');
        if ($(this).prop("checked") == false) {
            audioEl.removeAttr('autofadeout');
        } else {
            audioEl.attr('autofadeout', '');
        }
    }

    $(".boutonFadeIn").click(boutonFadeIn);

    function boutonFadeIn() {
        let monObjet = $(this).parent().parent().children('.playeur').children('audio')[0];
        let monVolume = $(this).parent().parent().children('.playeur').children('audio').data('volume');
        let monEtat = $(this).parent().parent().children('.stateFade');
        let ceBouton = $(this);

        monEtat.text("Fade In START");

        ceBouton.addClass("clignotantBouton");
        monObjet.volume = 0;
        monObjet.play();

        let count = $(this).data("duree") / 20;
        let increment = monVolume / count;

        let fade = setInterval(function () {
            monObjet.volume = monObjet.volume + increment;
            count--;
            if (count <= 1) {
                clearInterval(fade);
                monObjet.volume = monVolume;
                monEtat.text("Fade In TERMINE");
                setTimeout(function () {
                    monEtat.text("–––");
                }, 3000);
                ceBouton.removeClass("clignotantBouton");
                console.log("fin Fade In");
            }
        }, 20);
    }

    $(".boutonFadeOut").click(boutonFadeOut);

    function boutonFadeOut() {
        let monObjet = $(this).parent().parent().children('.playeur').children('audio')[0];
        // let monVolume = $(this).parent().parent().children('.playeur').children('audio').data('volume');
        let monEtat = $(this).parent().parent().children('.stateFade');
        let ceBouton = $(this);
        let volumeOriginal = monObjet.volume;

        monEtat.text("Fade Out START");

        ceBouton.addClass("clignotantBouton");
        // monObjet.play();

        let count = $(this).data("duree") / 20;
        // let increment = monVolume / count;
        let increment = monObjet.volume / count;

        let fadeOut = setInterval(function () {
            monObjet.volume = monObjet.volume - increment;
            count--;
            if (count <= 1) {
                clearInterval(fadeOut);
                monObjet.volume = 0;
                monObjet.pause();
                monObjet.volume = volumeOriginal;
                monEtat.text("Fade Out TERMINE");
                setTimeout(function () {
                    monEtat.text("–––");
                }, 3000);
                ceBouton.removeClass("clignotantBouton");
                console.log("fin Fade Out");
            }
        }, 20);
    }

    $(".boutonVolumDef").click(boutonVolumDef);

    function boutonVolumDef() {
        let monObjet = $(this).parent().parent().children('.playeur').children('audio')[0];
        let monVolume = $(this).parent().parent().children('.playeur').children('audio').data('volume');
        let monEtat = $(this).parent().parent().children('.stateFade');

        monObjet.volume = monVolume;
        monEtat.text("Volume par défaut: ok");
        setTimeout(function () {
            monEtat.text("–––");
        }, 3000);
    }

    $(".boutonEnchaine").click(boutonEnchaine);

    function boutonEnchaine() {
        let monObjet = $(this).parent().parent().children('.playeur').children('audio')[0];
        let monVolume = $(this).parent().parent().children('.playeur').children('audio').data('volume');
        let monEtat = $(this).parent().parent().children('.stateFade');
        let ceBouton = $(this);
        let volumeOriginal = monObjet.volume;

        // monObjet.volume = monVolume;

        monEtat.text("Fade Out START");
        ceBouton.addClass("clignotantBouton");

        let count = $(this).data("duree") / 20;
        let increment = monObjet.volume / count;

        let fadeOut = setInterval(function () {
            monObjet.volume = monObjet.volume - increment;
            count--;
            if (count <= 1) {
                clearInterval(fadeOut);
                monObjet.volume = 0;
                monObjet.pause();
                monObjet.volume = volumeOriginal;
                monEtat.text("Fade Out TERMINE");
                setTimeout(function () {
                    monEtat.text("–––");
                }, 3000);
                ceBouton.removeClass("clignotantBouton");
                console.log("fin Fade Out");
            }
        }, 20);


        let monObjetSuivant = $(this).parent().parent().next().children('.playeur').children('audio')[0];
        let monVolumeSuivant = $(this).parent().parent().next().children('.playeur').children('audio').data('volume');
        let monEtatSuivant = $(this).parent().parent().next().children('.stateFade');

        monObjetSuivant.play();

        monEtatSuivant.text("Fade In START");

        monObjetSuivant.volume = 0;
        monObjetSuivant.play();

        let countSuiv = $(this).data("duree") / 20;
        let incrementSuiv = monVolumeSuivant / count;

        let fadeSuiv = setInterval(function () {
            monObjetSuivant.volume = monObjetSuivant.volume + incrementSuiv;
            countSuiv--;
            if (countSuiv <= 1) {
                clearInterval(fadeSuiv);
                monObjetSuivant.volume = monVolumeSuivant;
                monEtatSuivant.text("Fade In TERMINE");
                setTimeout(function () {
                    monEtatSuivant.text("–––");
                }, 3000);
                //  ceBouton.removeClass("clignotantBouton");
                console.log("fin Fade In");
            }
        }, 20);



        monEtat.text("fondu enchainée: ok");
        setTimeout(function () {
            monEtat.text("–––");
        }, 3000);
    }




    $("audio").on("timeupdate", audioTimeUpdate);

    function audioTimeUpdate(e) {
        let rest = e.target.duration - e.target.currentTime;

        /************* AUTO FADE OUT *************/
        if (e.target.paused == false) {
            if ($(this).attr("autofadeout") != undefined) {
                let cetObjet = $(this);
                let tempsFadeOut = cetObjet.data("autofadeout");
                console.log("tempsAutoFadeOut= " + tempsFadeOut);
                //console.log("tempsFadeOut direct= " + $(this).data("autofadeout"));
                if (rest <= tempsFadeOut / 1000) {
                    let monEtat = $(this).parent().parent().children('.stateFade');
                    monEtat.text("auto Fade Out: START");
                    console.log("début Fade Out");
                    cetObjet.removeAttr("autofadeout");
                    let count = tempsFadeOut / 20;
                    let increment = e.target.volume / count;
                    // e.target.volume = 0;
                    let volumeOriginal = e.target.volume;

                    let autofadeoutInter = setInterval(function () {
                        e.target.volume = e.target.volume - increment;
                        count--;
                        //console.log("count : " + count);
                        if (count <= 1) {
                            clearInterval(autofadeoutInter);
                            e.target.volume = 0;
                            console.log("fin Fade Out");
                            cetObjet.attr("autofadeout", '');
                            monEtat.text("auto Fade Out: FIN");
                            setTimeout(function () {
                                monEtat.text("–––");
                                e.target.volume = volumeOriginal;
                                // monEtat.text("volume reset");
                                // setTimeout(function () {
                                //     monEtat.text("–––");
                                // }, 3000);
                            }, 3000);
                        }
                    }, 20);
                }
            }
        }

        rest = formatSecondsAsTime(rest);
        $(this).parent().children(".timeRest").text(rest);

    }

    function roundDecimal(nombre, precision) {
        var precision = precision || 2;
        var tmp = Math.pow(10, precision);
        return Math.round(nombre * tmp) / tmp;
    }

    function formatSecondsAsTime(secs, format) {
        var hr = Math.floor(secs / 3600);
        var min = Math.floor((secs - (hr * 3600)) / 60);
        var sec = Math.floor(secs - (hr * 3600) - (min * 60));

        if (min < 10) {
            min = "0" + min;
        }
        if (sec < 10) {
            sec = "0" + sec;
        }

        if (min == 0 && sec < 3) {
            sec = roundDecimal(secs, 3);
            return sec;
        } else

            return min + ':' + sec;
    }


    $("audio").on("play", audioPlay);

    function audioPlay(e) {
        // $(this).parent().parent().css("background-color", "#e59d9d");
        $(this).parent().parent().removeClass('lectureFinie');
        $(this).parent().parent().addClass('lecture');
        $(this).parent().parent().removeClass('clignotantAudio');
        // $(this).parent().parent().removeClass('lecturePause');

        //                    let count = 200;
        //                    let increment = e.target.volume / count;
        //                    e.target.volume = 0;
        //
        //                    let fade = setInterval(function() {
        //                        e.target.volume = e.target.volume + increment;
        //                        count--;
        //                        if (count == 0)
        //                            clearInterval(fade);
        //                    }, 1);
    }

    $("audio").on("pause", audioPause);

    function audioPause() {
        $(this).parent().parent().addClass('clignotantAudio');
        // $(this).parent().parent().addClass('lecturePause');
    }

    $("audio").on("ended", audioEnded);

    function audioEnded() {
        $(this).parent().parent().removeClass('clignotantAudio');
        // $(this).parent().parent().removeClass('lecturePause');
        $(this).parent().parent().removeClass('lecture');
        $(this).parent().parent().addClass('lectureFinie');
        // $(this).parent().parent().css("background-color", "#88d888");
    }

    /************* ECRITURE DU FICHIER avec Titre du son *************/
    $(".nameDisplay").on("play", nameDisplay);

    function nameDisplay() {

        let texteObs = $(this).data("name") + " – ";

        // $.post("ecrire-fichier.php", {
        //     data: texteObs
        // }).done(function () {
        //     console.log("nameDisplay: ok");
        // }).fail(function () {
        //     console.log("ERREUR, PHP, POST fonctionne pas");
        //     alert("ERREUR, PHP \nPOST ne fonctionne pas");
        // });

        fs.writeFile(`${desktopDir}/audio_OBS.txt`, texteObs, function (err) {
            if (err) return console.log(err);
            console.log('Text OBS : ok');
        });

    }



    /************* BOUTONs GENERAL *************/
    $("#masquerBouton").click(function () {
        if ($(this).data("state") == "visible") {
            $('.divOptions').hide();
            $(this).text("afficher les boutons");
            $(this).data("state", "hide");
        } else if ($(this).data("state") == "hide") {
            $('.divOptions').show();
            $(this).text("masquer les boutons");
            $(this).data("state", "visible");
        }
    });

    $("#resetAllVolume").click(function () {
        $(".boutonVolumDef").click();
    });


    /*********************************************** */
    /****************** FONCTION REFRESH LISTENEUR **************** */
    function refreshListeneur() {
        console.log("REFRESH LISTENEUR");
        audioElement = document.querySelectorAll('audio');

        $('.checkboxAutoFadeOut').off();
        $(".boutonFadeIn").off();
        $(".boutonFadeOut").off();
        $(".boutonVolumDef").off();
        $(".boutonEnchaine").off();
        $("audio").off();
        $(".nameDisplay").off();
        $('figure').off();


        $('.checkboxAutoFadeOut').change(checkboxAutoFadeOutChange);
        $(".boutonFadeIn").click(boutonFadeIn);
        $(".boutonFadeOut").click(boutonFadeOut);
        $(".boutonVolumDef").click(boutonVolumDef);
        $(".boutonEnchaine").click(boutonEnchaine);
        $("audio").on("timeupdate", audioTimeUpdate);
        $("audio").on("play", audioPlay);
        $("audio").on("pause", audioPause);
        $("audio").on("ended", audioEnded);
        $(".nameDisplay").on("play", nameDisplay);
        $('figure').contextmenu(figureContextMenu);
    }

    /*********************************************************************/
    /************* BOUTON SETTING *************/
    let settingDiv = $("#setting");
    settingDiv.hide();
    settingDiv.attr("visible", false);
    document.getElementById("openSetting").addEventListener('click', function () {
        if (settingDiv.attr("visible") == "false") {
            settingDiv.show();
            settingDiv.attr("visible", true);
        } else {
            settingDiv.hide();
            settingDiv.attr("visible", false);
        }
    });
    document.getElementById("closeSetting").addEventListener('click', function () {
        settingDiv.hide();
        settingDiv.attr("visible", false);
    });

    document.getElementById("leBoutonAcceuilSettings").addEventListener('click', function () {
        settingDiv.show();
        settingDiv.attr("visible", true);
    });


    $("#applyConfFile").hide();
    $("#loadConfFile").change(function () {
        console.log($(this).val());
        $("#applyConfFile").show();
    });

    $("#headerFileName").hide();
    document.getElementById("applyConfFile").addEventListener('click', function () {
        $("#conteneur").children().remove();
        $(".infoStart").hide();

        let file = $("#loadConfFile").val();
        let rawdata = fs.readFileSync(file);
        let objJsonLoad = JSON.parse(rawdata);
        console.log(objJsonLoad);

        $("#headerFileName").text(file);
        $("#headerFileName").show();

        for (let i = 0; i < objJsonLoad.length; i++) {
            if (objJsonLoad[i].typeTitre == undefined) {
                let newelem = $(`<figure>
                   <figcaption>${objJsonLoad[i].name}</figcaption>
                   <div class="playeur">
                       <audio src="${objJsonLoad[i].src}" class="${objJsonLoad[i].class}" data-name="${objJsonLoad[i].dataName}" data-volume="${objJsonLoad[i].dataVolume}" data-autofadeout="${objJsonLoad[i].dataAutofadeout}" ${objJsonLoad[i].autofadeout != undefined ? 'autofadeout' : ''}></audio>
                   </div>
               </figure>`);
                $('#conteneur').append(newelem);
                nouvelElemAudio(newelem);
            } else {
                let newelem = $(`<figure class="textInfos"> <figcaption>${objJsonLoad[i].name}</figcaption> </figure>`);
                $('#conteneur').append(newelem);
            }
        }
        settingDiv.hide();
        settingDiv.attr("visible", false);

    });



    document.getElementById("saveConfFile").addEventListener('click', function () {
        let lesFigure = document.querySelectorAll("figure");
        console.log(lesFigure);
        let confJson = [];
        for (let i = 0; i < lesFigure.length; i++) {
            console.log($(lesFigure[i]));
            let obj = $(lesFigure[i]);
            let unObjet;
            if ($(lesFigure[i]).hasClass('textInfos')) {
                //console.log("un texte");
                 unObjet = {
                    "name": obj.children("figcaption").text(),
                    "typeTitre": 1
                };
            } else {
                 unObjet = {
                    "name": obj.children("figcaption").text(),
                    "src": obj.children().children("audio").attr('src'),
                    "class": obj.children().children("audio").attr('class'),
                    "dataName": obj.children().children("audio").attr('data-name'),
                    "dataVolume": roundDecimal(obj.children().children("audio")[0].volume, 1),
                    "dataAutofadeout": obj.children().children("audio").attr('data-autofadeout'),
                    "autofadeout": obj.children().children("audio").attr('autofadeout')
                };
            }
            confJson.push(unObjet);
        }

        console.log(confJson);
        let fileDl = JSON.stringify(confJson);
        console.log(fileDl);

        console.log($('#saveConfFile').parent().children('a'));

        // if ($('#saveConfFile').parent().children('a').length != 0) {
        //     let url = $('#saveConfFile').parent().children('a').attr('saveLink');
        //     window.URL.revokeObjectURL(url);
        //     $('#saveConfFile').parent().children('a').remove();
        // }

        download(fileDl, 'LeStudio-LecteurAudio-config', 'application/JSON');


        // var file = new File([fileDl], "LeStudio-LecteurAudio-config", { type: "application/JSON" });
        // FileSaver.saveAs(file);


    });

    // Function to download data to a file
    function download(data, filename, type) {
        var file = new Blob([data], {
            type: type
        });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            a.innerHTML = "clique droit: enregister le lien sous...";
            // a.setAttribute('saveLink', url);
            document.body.appendChild(a);
            // document.getElementById('saveConfFile').parentElement.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }


    document.getElementById("clearList").addEventListener('click', function () {
        $("#conteneur").children().remove();
        $("#headerFileName").text('');
        $("#headerFileName").hide();
        $(".infoStart").show();
    });

        /************* ECRITURE DU FICHIER txt OBS - bouton test *************/
        document.getElementById("CreateOBStxt").addEventListener('click', function () {
            let texteObs = "TEST OBS" + " – ";
            fs.writeFile(`${desktopDir}/audio_OBS.txt`, texteObs, function (err) {
                if (err) return console.log(err);
                console.log('Text OBS : ok');
            });
        });


    document.getElementById("addBoutonAjouter").addEventListener('click', function () {
        let name = $("#addNonDuSon").val();
        let file = $("#addLoadSonfFile").val();
        if (name != '' && file != '') {
            let texteObs = $("#addTexteObs").val();

            $("#addNonDuSon").removeClass('lesBordsRouge');
            $("#addLoadSonfFile").removeClass('lesBordsRouge');

            $(".infoStart").hide();

            let newelem = $(`<figure>
                       <figcaption>${name}</figcaption>
                       <div class="playeur">
                          <audio src="${file}" class="${texteObs ? 'nameDisplay' : ''}" data-name="${texteObs}" data-volume="${1}" data-autofadeout="${1000}"></audio>
                      </div>
                 </figure>`);
            $('#conteneur').append(newelem);
            nouvelElemAudio(newelem);
            console.log(newelem);
        } else {
            $("#addNonDuSon").addClass('lesBordsRouge');
            $("#addLoadSonfFile").addClass('lesBordsRouge');
        }
    });

    document.getElementById("addBoutonAjouterJingleStudioCool").addEventListener('click', function () {
        $(".infoStart").hide();
        let newelem = $(`<figure>
                            <figcaption>Jingle Studio cool</figcaption>
                            <div class="playeur">
                                <audio src="son/JingleStudioCool.wav" class="" data-name="Jingle Studio" data-volume="0.7" data-autofadeout="1000"></audio>
                            </div>
                        </figure>`);
        $('#conteneur').append(newelem);
        nouvelElemAudio(newelem);
    });

    document.getElementById("addBoutonAjouterTexteListe").addEventListener('click', function () {
        let name = $("#addTexteListe").val();
        if (name != '') {
            $(".infoStart").hide();
            $("#addTexteListe").val('');
            $("#addTexteListe").removeClass('lesBordsRouge');
            let newelem = $(`<figure class="textInfos"> <figcaption>${name}</figcaption> </figure>`);
            $('#conteneur').append(newelem);
            refreshListeneur();
        } else {
            $("#addTexteListe").addClass('lesBordsRouge');
        }
    });


    function nouvelElemAudio(elm) {
        let timeRestElem = $('<p/>', { class: `timeRest` });
        timeRestElem.text("00:00");
        elm.children(".playeur").append(timeRestElem);
        //                    elm.attr('controls', '');
        elm.children(".playeur").children("audio").attr("controls", '');
        elm.children(".playeur").children("audio").attr("controlsList", 'nodownload');

        if (elm.children(".playeur").children("audio").data("volume") != undefined)
            elm.children(".playeur").children("audio")[0].volume = elm.children(".playeur").children("audio").data("volume");

        //                    console.log(elm.attr("autofadeout"));
        let check = false;
        if (elm.children(".playeur").children("audio").attr("autofadeout") != undefined)
            check = true;

        elm.append(`<div class="divOptions"> <button class="boutonFadeIn" data-duree="500">Fade In 0,5s</button> <button class="boutonFadeOut" data-duree="500">Fade Out 0,5s</button> <button class="boutonVolumDef">Vol. par defaut</button> </div>`);
        elm.children(".divOptions").append(`<button class="boutonFadeIn" data-duree="2000">Fade In 2s</button> <button class="boutonFadeOut" data-duree="2000">Fade Out 2s</button> `);
        elm.append(` <p class="stateFade"> ––– </p> `);
        elm.children(".divOptions").append(`<button class="boutonEnchaine" data-duree="2000">enchainé 2s</button> `);

        elm.children(".divOptions").append(`<input title="auto Fade Out" id="${"autoFadeOut" + (indexAudio + 1)}" class="checkboxAutoFadeOut" type="checkbox" ${check == true ? 'checked' : ''} > <label for="${"autoFadeOut" + (indexAudio + 1)}" class="checkboxAutoFadeOutLabel">auto fade out</label> `);
        indexAudio++;
        //console.log("indexAudio= "+indexAudio);

        refreshListeneur();
    }


    /**************** CLIQUE DROIT POPUP **************** */


    var mouseX, mouseY, windowWidth, windowHeight;
    var popupLeft, popupTop;
    let popupOption;
    //let peudoConnecte;

    popupOption = $("#popupClickDroit");
    popupOption.hide();

    $(document).mousemove(function (e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        //To Get the relative position
        if (this.offsetLeft != undefined)
            mouseX = e.pageX - this.offsetLeft;
        if (this.offsetTop != undefined)
            mouseY = e.pageY; - this.offsetTop;

        if (mouseX < 0)
            mouseX = 0;
        if (mouseY < 0)
            mouseY = 0;

        windowWidth = $(window).width() + $(window).scrollLeft();
        windowHeight = $(window).height() + $(window).scrollTop();
    });

    $('figure').contextmenu(figureContextMenu);

    function figureContextMenu(evt) {
        evt.preventDefault();
        popupOption.show();
        popupOption.children("#popupName").focus();

        var popupWidth = $('#popupClickDroit').outerWidth();
        var popupHeight = $('#popupClickDroit').outerHeight();

        if (mouseX + popupWidth > windowWidth)
            popupLeft = mouseX - popupWidth;
        else
            popupLeft = mouseX;

        if (mouseY + popupHeight > windowHeight)
            popupTop = mouseY - popupHeight;
        else
            popupTop = mouseY;

        if (popupLeft < $(window).scrollLeft()) {
            popupLeft = $(window).scrollLeft();
        }

        if (popupTop < $(window).scrollTop()) {
            popupTop = $(window).scrollTop();
        }

        if (popupLeft < 0 || popupLeft == undefined)
            popupLeft = 0;
        if (popupTop < 0 || popupTop == undefined)
            popupTop = 0;

        popupOption.offset({
            top: popupTop,
            left: popupLeft
        });


        let elemCliquer = $(this);


        popupOption.children("#popupName").val(elemCliquer.children('figcaption').text());
        if (!elemCliquer.hasClass("textInfos")) {
            popupOption.children("#popupTxtObs").show(); //-----
            popupOption.children("#popupDuree").show(); //-----
            popupOption.children("label[for='popupDuree']").show(); //-----
            popupOption.children("label[for='popupTxtObs']").show(); //-----
            popupOption.children("#popupTxtObs").val(elemCliquer.children('.playeur').children('audio').attr('data-name'));
            popupOption.children("#popupDuree").val(elemCliquer.children('.playeur').children('audio').attr('data-autofadeout'));
        } else {
            popupOption.children("#popupTxtObs").hide(); //-----
            popupOption.children("#popupDuree").hide(); //-----
            popupOption.children("label[for='popupDuree']").hide(); //-----
            popupOption.children("label[for='popupTxtObs']").hide(); //-----
        }
        $("#popupValider").click(popupValider);

        function popupValider() {
            if (!elemCliquer.hasClass("textInfos")) {
                elemCliquer.children('.playeur').children('audio').attr('data-autofadeout', popupOption.children("#popupDuree").val());
                elemCliquer.children('.playeur').children('audio').attr('data-name', popupOption.children("#popupTxtObs").val());
            }
            elemCliquer.children('figcaption').text(popupOption.children("#popupName").val())
            popupOption.hide();
            //elemCliquer.children('.playeur').children('audio').off();
            //elemCliquer.children('.playeur').children('audio').on("timeupdate", audioTimeUpdate);
            refreshListeneur();
            let etat = elemCliquer.children('.stateFade');
            etat.text('Valeurs mises à jour');
            setTimeout(function () {
                etat.text("–––");
            }, 3000);
        }
        $("#popupValider").off();
        $("#popupValider").click(popupValider);

        /***** ENTER POUR ENVOYER *****/
        popupOption.keypress(function (event) {
            // console.log(evt.which);
            if (event.which == 13) {
                event.preventDefault();
                $("#popupValider").trigger("click");
            }
        });

        $("#popupSupp").click(popupSupp);

        function popupSupp() {
            elemCliquer.remove();
            popupOption.hide();
        }
        $("#popupSupp").off();
        $("#popupSupp").click(popupSupp);
    }

    $('html').click(function (evt) {
        popupOption.hide();
        // console.log("click en dehors de la popup")
    });

    popupOption.click(function (evt) {
        evt.stopPropagation();
    });

    /***** TRIG AU SCROLL *****/
    $(window).scroll(function (evt) {
        popupOption.hide();
        // settingDiv.hide();
        // settingDiv.attr("visible", false);
    });

    /*************************************************************** */

    let player = document.getElementById("conteneur");
    new Sortable(player, {
        handle: 'figcaption',
        animation: 200
    })


    /*************************************************************** */

    // var win = nw.Window.get();
    // win.showDevTools();

});