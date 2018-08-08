var queryArr = [];
var string = "";
var startData = 0;

// mendefinisikan variable untuk status saat melakukan 'GET' dari API
var message = document.getElementById("message");
// mendefinisikan variable untuk footer, sehingga bisa diinputkan data copyright dari Marvel
var footer = document.getElementById("footer");


// mendefinisikan variable untuk menghitung total character & total character yg sudah sukses dipanggil oleh API
var currentCount =  document.getElementById("currentCount");
var totalCount =  document.getElementById("totalCount");

// mendefinisikan variable untuk menyiapkan & memunculkan isi dari data // DEFINISI-1
var marvelContainer =  document.getElementById("marvelContainer");
// mendefinisikan variable untuk secara dinamis update load more
var marvelMore =  document.getElementById("loadMore");

// mendefinisikan variable untuk menyiapkan & memunculkan isi dari hasil pencarian
var marvelFinder =  document.getElementById("marvelFinder");

// mendefinisikan variable untuk menyiapkan list comics
var marvelComics =  document.getElementById("marvelComics");

function marvel(offset) {
    var url = "http://gateway.marvel.com/v1/public/characters?limit=100&offset=" + offset + "&ts=1&apikey=a5401f176123d1f1f35dfc8fc85dfd9c&hash=c2169194542dcf8a6469597a7dc95ede"
    
    $("#marvelCharacter").hide();
    $("#message").show();

    $.ajax({
        url: url,
        type: "GET",

        // 1. call the API
        beforeSend: function() {
            // 1.1 Saat loading, munculkan "info loading.."
            message.innerHTML = "Loading Marvel Characters..."
        },
        complete: function() {
            // 1.2 Saat sukses mengambil API, munculkan "info sukses.."
            //message.innerHTML = "Succesfull!"

            // hide loading message
            $("#message").hide();
            $(".search").show();
            $("footer").show();
        },

        // 2. Cek apakah sukses/nggak
        success: function(data) {
            // 2.1 Jika sukses, perlihatkan di footer bahwa data yang ditampilkan merupakan hak milik Marvel
            footer.innerHTML = data.attributionHTML;

            var currentCharacter = offset + data.data.results.length;
            var totalCharacter = data.data.total;

            $("#countCharacter").show();
            currentCount.innerHTML = currentCharacter;
            totalCount.innerHTML = totalCharacter;

            $("#marvelCharacter").show();

            // karena akan dikeluarkan berupa images & nama, maka cukup array di data.data.results (.length utk mengetahui batas ujung data)
            for (var i = 0; i < data.data.results.length; i++) {
                // persingkat data yang akan digunakan pada array ke 'i', dimana nantinya akan dikeluarkan nama & images
                var element = data.data.results[i];
                var img_url = element.thumbnail.path + "/standard_fantastic." + element.thumbnail.extension;
                var deskripsi = element.description;
                var num_comic = element.comics.available;

                queryStr = { "id" : element.id, "name" : element.name, "thumb" : img_url, "description" : deskripsi, "num_comic" : num_comic };
                queryArr.push(queryStr);
            }

            console.log(queryArr);

            showData();

            // munculkan ke element HTML yg sudah didefinisikan pada DEFINISI-1
            marvelContainer.innerHTML = string;

            // dynamic update load more (button)

            nextOffset = offset + 100;

            var nextChar = "";

            if ((nextOffset-1) < totalCharacter)
            {
                nextChar += "<button class='btn btn-danger' onclick='marvel(" + nextOffset + ");'>";
                nextChar += "Load More";
                nextChar += "</button>";
            }

            marvelMore.innerHTML = nextChar;
        },
        error: function() {
            // 2.2 Klo gagal, munculkan "sorry.."
            message.innerHTML = "Sorry, data failed to load!"
        }
    });
};

function Comics(character_id) {
    var url = "https://gateway.marvel.com:443/v1/public/comics?characters=" + character_id + "&limit=100&ts=1&apikey=a5401f176123d1f1f35dfc8fc85dfd9c&hash=c2169194542dcf8a6469597a7dc95ede"

    $("#marvelCharacter").hide();
    $("#message").show();

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
            //$("footer").show();

            $(".search").hide();
            
        },

        // 2. Cek apakah sukses/nggak
        success: function(data) {
            // 2.1 Jika sukses, perlihatkan di footer bahwa data yang ditampilkan merupakan hak milik Marvel
            footer.innerHTML = data.attributionHTML;

            $("#marvelComics").show();

            if (data.data.results.length > 1)
            {
                // mempersiapkan variable dinamis yang dapat diisi dengan content pada API data Marvel characters
                var char = "";
                char += "<div class='row'>";

                    // page title
                    char += "<div class='col-md-12'>";
                    char += "<h2>COMICS: " + data.data.results[0].characters.items[0].name + "</h2>";
                    char += "</div>";
                char += "</div>";
                
                char += "<div class='row'>"; // DEFINISI-2, sekedar penanda untuk memudahkan

                // loop, untuk mengeluarkan semua data
                // karena akan dikeluarkan berupa images & nama, maka cukup array di data.data.results (.length utk mengetahui batas ujung data)
                for (var i = 0; i < data.data.results.length; i++) {
                    // persingkat data yang akan digunakan pada array ke 'i', dimana nantinya akan dikeluarkan nama & images
                    var element = data.data.results[i];

                    // mengeluarkan data dalam 4 kolom (12 dibagi 4 = 3, jadi dibutuhkan col-3)
                    char += "<div class='col-md-3 marvelChar'>";

                        // keluarkan img thumbnail
                        var img_url = element.thumbnail.path + "/portrait_uncanny." + element.thumbnail.extension;
                        char += "<img src=" + img_url + " class='thumb'>";

                        // keluarkan nama karakter
                        char += "<p class='comic-title'>" + element.title + "</p>";
                        char += "<span>" + element.creators.items[0].name + "</span>";
                    char += "</div>";


                    // check untuk setiap 4 data yang dikeluarkan, buatkan row baru (supaya bisa lebih dinamis dengan DEFINISI-2)
                    if ( (i+1) % 4 == 0) {
                        char += "</div>";
                        char += "<div class='row'>";
                    }
                }
            }
            else
            {
                var char = "";
                char += "<div class='absolute-center'>";
                    char += "<h1>404</h1>";
                    char += "<p>This Characters doesnt have any related comics</p>";

                    char += "<div>";
                    char += "<a href='index.html'>« Go Back</a>";
                    char += "</div>";
                char += "</div>";
            }

            // munculkan ke element HTML yg sudah didefinisikan pada DEFINISI-1
            marvelComics.innerHTML = char;
        },
        error: function() {
            // 2.2 Klo gagal, munculkan "sorry.."
            message.innerHTML = "Sorry, data failed to load!"
        }
    });
};

function showData() {
    // mempersiapkan variable dinamis yang dapat diisi dengan content pada API data Marvel characters
    string += "<div class='row'>"; // DEFINISI-2, sekedar penanda untuk memudahkan

    // loop, untuk mengeluarkan semua data
    // karena akan dikeluarkan berupa images & nama, maka cukup array di data.data.results (.length utk mengetahui batas ujung data)
    for (var i = 0; i < queryArr.length; i++) {
        // persingkat data yang akan digunakan pada array ke 'i', dimana nantinya akan dikeluarkan nama & images
        var storageArray = queryArr[i];

        //queryStr = { "id" : element.id, "name" : element.name, "thumb" : img_url, "description" : deskripsi, "num_comic" : num_comic };

        // mengeluarkan data dalam 4 kolom (12 dibagi 4 = 3, jadi dibutuhkan col-3)
        string += "<div class='col-md-3 marvelChar'>";

            // hyperlink untuk melihat detail (ini open in new page)
            //string += "<a href='detail.html?id=" + storageArray.id + "' target='_blank'>";

            // hyperlink untuk melihat detail
            string += "<a href='#' onclick='Comics(" + storageArray.id + ")'>";

                // keluarkan img thumbnail
                string += "<img src=" + storageArray.thumb + " class='thumb'>";

                // baca deskripsi untuk menampilkan saat suatu karakter di click

                // keluarkan nama karakter
                string += "<p>" + storageArray.name + "</p>";

            string += "</a>";
        string += "</div>";


        // check untuk setiap 4 data yang dikeluarkan, buatkan row baru (supaya bisa lebih dinamis dengan DEFINISI-2)
        if ( (i+1) % 4 == 0) {
            string += "</div>";
            string += "<div class='row'>";
        }
    }

    string += "</div>";

    // munculkan ke element HTML yg sudah didefinisikan pada DEFINISI-1
    marvelContainer.innerHTML = string;
}

// Open/Closed Form Search
$(".openSearch").click(function() {
    $("#findCharacter").val("");

   $("#formSearch").show();
   $("#findCharacter").focus();

    $("#marvelCharacter").show();
    $("#marvelResult").hide();

    $("body").css({"overflow":"hidden"});
});
$("#closeForm").click(function() {
   $("#formSearch").hide();

    $("body").css({"overflow":"auto"});
});

$("#hapusFilter").click(function() {
    console.log('hapus hasil pencarian');
    $("#marvelCharacter").show();
    $("#marvelResult").hide();

    $("body").css({"overflow":"auto"});
});

// Ketika Search dilakukan (pressed Enter), maka update container
$("#findCharacter").keyup(function(event) {
    // jika case sensitive, cukup fungsi ini saja
    var formCari = $(this).val();

    // lakukan pencarian data ketika Enter ditekan
    if (event.keyCode === 13) {
        $("#message").hide();

        $("body").css({"overflow":"auto"});

        // jika case sensitive, matikan fungsi ini
        formCari = formCari.toLowerCase();


        // cari data pada array yg sudah disimpan
        var data = $.grep(queryArr, function (e) {

            // jika case sensitive, cukup fungsi ini saja
            fieldCari = e.name;

            // jika case sensitive, matikan fungsi ini
            fieldCari = e.name.toLowerCase();

            return fieldCari === formCari;
            console.log(e);
        });

        var keyword = "";

                // cari tahu, apakah data ditemukan / tidak
                if (data.length === 0)
                {
                    // jika tidak ketemu, keluarkan informasi
                    console.log('not found: ' + formCari);

                    keyword += "<p>Marvel Character Name</p>";
                    keyword += "<h1 class='result-word'>" + formCari + "</h1>";
                    keyword += "<p>are <b>Not Found</b></p>";
                }
                else
                {
                    // keluarkan id jika ketemu
                    var hasilCariId = data[0].id;
                    console.log('found: ' + formCari);
                    console.log(hasilCariId);

                    // tentukan output yg akan dikeluarkan
                    var char_id = data[0].id;
                    var char_name = data[0].name;
                    var char_url = data[0].thumb;
                    var char_desc = data[0].description;


                    // hyperlink untuk melihat detail
                    //keyword += "<a href='detail.html?id=" + char_id + "'>";
                    keyword += "<a href='#' onclick='Comics(" + char_id + ")'>";

                    // keluarkan img thumbnail
                    keyword += "<img src=" + char_url + " class='thumb'>";
                    // keluarkan nama karakter
                    keyword += "<h2>" + char_name + "</h2>";

                    keyword += "</a>";

                    if (!char_desc)
                    {
                        keyword += "<p> ??? </p>";
                    }
                    else
                    {
                        keyword += "<p>" + char_desc + "</p>";
                    }
                }

        $("#formSearch").hide();
        $("#marvelCharacter").hide();
        $("#marvelResult").show();

        marvelFinder.innerHTML = keyword;
    }
});

// filter by has Comics
$("#filterbyComics").on("change", function()
{
    var stringFilter = "";

    var checked = $(this).prop("checked");
    if (checked)
    {
        console.log('checkbox di check');

        var dataFilter = $.grep(queryArr, function (e) {
            return e.num_comic > 0;
            console.log(e);
        });
    }
    else
    {
        console.log('checkbox di un-check');

        var dataFilter = $.grep(queryArr, function (e) {
            return e;
            console.log(e);
        });
    }

        // Update element HTML

        // mempersiapkan variable dinamis yang dapat diisi dengan content pada API data Marvel characters
        stringFilter += "<div class='row'>"; // DEFINISI-2, sekedar penanda untuk memudahkan

        // loop, untuk mengeluarkan semua data
        // karena akan dikeluarkan berupa images & nama, maka cukup array di data.data.results (.length utk mengetahui batas ujung data)
        for (var i = 0; i < dataFilter.length; i++) {
            // persingkat data yang akan digunakan pada array ke 'i', dimana nantinya akan dikeluarkan nama & images
            var storageArray = dataFilter[i];

            //queryStr = { "id" : element.id, "name" : element.name, "thumb" : img_url, "description" : deskripsi, "num_comic" : num_comic };

            // mengeluarkan data dalam 4 kolom (12 dibagi 4 = 3, jadi dibutuhkan col-3)
            stringFilter += "<div class='col-md-3 marvelChar'>";

                // hyperlink untuk melihat detail (ini open in new page)
                //stringFilter += "<a href='detail.html?id=" + storageArray.id + "' target='_blank'>";

                // hyperlink untuk melihat detail
                stringFilter += "<a href='#' onclick='Comics(" + storageArray.id + ")'>";

                    // keluarkan img thumbnail
                    stringFilter += "<img src=" + storageArray.thumb + " class='thumb'>";

                    // baca deskripsi untuk menampilkan saat suatu karakter di click

                    // keluarkan nama karakter
                    stringFilter += "<p>" + storageArray.name + "</p>";

                stringFilter += "</a>";
            stringFilter += "</div>";


            // check untuk setiap 4 data yang dikeluarkan, buatkan row baru (supaya bisa lebih dinamis dengan DEFINISI-2)
            if ( (i+1) % 4 == 0) {
                stringFilter += "</div>";
                stringFilter += "<div class='row'>";
            }
        }

        stringFilter += "</div>";

        // munculkan ke element HTML yg sudah didefinisikan pada DEFINISI-1
        marvelContainer.innerHTML = stringFilter;
});

// render API
marvel(startData); //default offset are 0, to load data start from 0, karena Marvel API tidak bisa meload semua data sekaligus