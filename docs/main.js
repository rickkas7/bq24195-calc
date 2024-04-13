
$(document).ready(function() {
    console.log('loaded');

    const converter = new showdown.Converter({
        extensions: [
            showdownKatex({
                throwOnError: true,
                displayMode: true,
                errorColor: '#1500ff',
                delimiters: [
                    { left: "$", right: "$", display: false },
                    { left: '~', right: '~', display: false, asciimath: true },
                ],
            }),
        ],
    });

    fetch('main.md') 
        .then(response => response.text())
        .then(function(md) {
            $('#content').html(converter.makeHtml(md)); 
        });


});