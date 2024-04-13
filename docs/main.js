
$(document).ready(function() {
    console.log('loaded');

    const thermistorResistance = [
        {
            temp: -50,
            value: 329500,
        },
        {
            temp: -40,
            value: 188500,
        },
        {
            temp: -30,
            value: 111300,
        },
        {
            temp: -20,
            value: 67770,
        },
        {
            temp: -10,
            value: 42470,
        },
        {
            temp: 0,
            value: 27280,
        },
        {
            temp: 10,
            value: 17960,
        },
        {
            temp: 20,
            value: 12090,
        },
        {
            temp: 25,
            value: 10000,
        },
        {
            temp: 30,
            value: 8313,
        },
        {
            temp: 40,
            value: 5827,
        },
        {
            temp: 50,
            value: 4160,
        },
        {
            temp: 60,
            value: 3020,
        },
        {
            temp: 70,
            value: 2228,
        },
        {
            temp: 80,
            value: 1668,
        },
        {
            temp: 85,
            value: 1451,
        },
        {
            temp: 90,
            value: 1266,
        },
        {
            temp: 100,
            value: 973.1,
        },
        {
            temp: 110,
            value: 757.6,
        },
    ];

    const resistanceForTemperature = function(degC) {
        for(let ii = 0; ii < thermistorResistance.length - 1; ii++) {
            if (degC >= thermistorResistance[ii].temp && degC < thermistorResistance[ii+1].temp) {
                let calc = {degC};

                calc.v1 = calc.degC - thermistorResistance[ii].temp;
                calc.d1 = thermistorResistance[ii+1].temp - thermistorResistance[ii].temp;
                calc.d2 = thermistorResistance[ii+1].value - thermistorResistance[ii].value;

                calc.result = calc.v1 * calc.d2 / calc.d1 + thermistorResistance[ii].value;

                // console.log('calc', calc);

                return calc.result;
            }
        }
        return NaN;
    }

    const updateFields = function(obj) {
        for(const key in obj) {
            let value = obj[key];

            if (typeof value == 'number') {
                value = Math.round(value * 100) / 100;
            }

            $('span[data-key="' + key + '"').text(value);
        }
    }


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
        tables: true,
    });

    fetch('main.md') 
        .then(response => response.text())
        .then(function(md) {
            $('#content').html(converter.makeHtml(md)); 



            const calculateResistance = function() {
                let param = {};
                // vref can actually be anything, but this is just here to prove it's the case by
                // changing it to other values. It's the voltage on REGN.
                param.vref = 6.0;

                param.tempLow = parseFloat($('#resCalcLow').val());
                param.tempHigh = parseFloat($('#resCalcHigh').val());

                param.rthcold = resistanceForTemperature(param.tempLow);
                param.rthhot = resistanceForTemperature(param.tempHigh);

                param.vltf = 0.735 * param.vref;
                param.vhtf = 0.472 * param.vref;
                param.vtco = 0.447 * param.vref;

                param.rt2 = (param.vref * param.rthcold * param.rthhot * (1/param.vltf - 1/param.vtco)) / 
                    (param.rthhot * (param.vref / param.vtco - 1) - param.rthcold * param.vref/param.vltf - 1);

                param.rt1 = (param.vref/param.vltf - 1) / (1/param.rt2 + 1/param.rthcold);

                console.log('resCalc', param);

                updateFields(param);
            };
            calculateResistance();

            $('#resCalcHigh,#resCalcLow').on('input', calculateResistance);
        
        
        });

    
});