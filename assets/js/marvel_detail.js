var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
var character_id = getUrlParameter('id');

// mendefinisikan variable untuk status saat melakukan 'GET' dari API
var message = document.getElementById("message");
// mendefinisikan variable untuk footer, sehingga bisa diinputkan data copyright dari Marvel
var footer = document.getElementById("footer");
// mendefinisikan variable untuk menyiapkan & memunculkan isi dari data // DEFINISI-1
var marvelContainer =  document.getElementById("marvelContainer");

function marvelComics() {
    var url = "https://gateway.marvel.com:443/v1/public/comics?characters=" + character_id + "&limit=100&ts=1&apikey=a5401f176123d1f1f35dfc8fc85dfd9c&hash=c2169194542dcf8a6469597a7dc95ede"

    $.ajax({
        url: url,
        type: "GET",

        // 1. call the API
        beforeSend: function() {
            // 1.1 Saat loading, munculkan "info loading.."
            message.innerHTML = "Loading Comics Lists..."
        },
        complete: function() {
            // 1.2 Saat sukses mengambil API, munculkan "info sukses.."
            //message.innerHTML = "Succesfull!"

            // hide loading message
            $("#message").hide();
            $("footer").show();
        },

        // 2. Cek apakah sukses/nggak
        success: function(data) {
            // 2.1 Jika sukses, perlihatkan di footer bahwa data yang ditampilkan merupakan hak milik Marvel
            footer.innerHTML = data.attributionHTML;

            if (data.data.results.length > 1)
            {
                // mempersiapkan variable dinamis yang dapat diisi dengan content pada API data Marvel characters
                var string = "";
                string += "<div class='row'>";

                    // page title
                    string += "<div class='col-md-12'>";
                    string += "<h2>COMICS: " + data.data.results[0].characters.items[0].name + "</h2>";
                    string += "</div>";
                string += "</div>";
                
                string += "<div class='row'>"; // DEFINISI-2, sekedar penanda untuk memudahkan

                // loop, untuk mengeluarkan semua data
                // karena akan dikeluarkan berupa images & nama, maka cukup array di data.data.results (.length utk mengetahui batas ujung data)
                for (var i = 0; i < data.data.results.length; i++) {
                    // persingkat data yang akan digunakan pada array ke 'i', dimana nantinya akan dikeluarkan nama & images
                    var element = data.data.results[i];

                    // mengeluarkan data dalam 4 kolom (12 dibagi 4 = 3, jadi dibutuhkan col-3)
                    string += "<div class='col-md-3 marvelChar'>";

                        // keluarkan img thumbnail
                        var img_url = element.thumbnail.path + "/portrait_uncanny." + element.thumbnail.extension;
                        string += "<img src=" + img_url + " class='thumb'>";

                        // keluarkan nama karakter
                        string += "<p class='comic-title'>" + element.title + "</p>";
                        string += "<span>" + element.creators.items[0].name + "</span>";
                    string += "</div>";


                    // check untuk setiap 4 data yang dikeluarkan, buatkan row baru (supaya bisa lebih dinamis dengan DEFINISI-2)
                    if ( (i+1) % 4 == 0) {
                        string += "</div>";
                        string += "<div class='row'>";
                    }
                }
            }
            else
            {
                var string = "";
                string += "<div class='absolute-center'>";
                    string += "<h1>404</h1>";
                    string += "<p>This Characters doesnt have any related comics</p>";

                    string += "<div>";
                    string += "<a href='index.html'>« Go Back</a>";
                    string += "</div>";
                string += "</div>";
            }

            // munculkan ke element HTML yg sudah didefinisikan pada DEFINISI-1
            marvelContainer.innerHTML = string;
        },
        error: function() {
            // 2.2 Klo gagal, munculkan "sorry.."
            message.innerHTML = "Sorry, data failed to load!"
        }
    });
}

// call function to get list of comics
marvelComics();