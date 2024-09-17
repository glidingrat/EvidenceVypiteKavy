$(document).ready(function() {
    window.updateTextInput = function(range, countId) {
        $('#' + countId).text(range.value);
    }

    $('#coffeeForm').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serializeArray();
        const data = {};
        formData.forEach(item => {
            data[item.name] = item.value;
        });

        if (!data.user) {
            alert('Vyberte osobu.');
            return;
        }

        $.ajax({
            url: 'http://ajax1.lmsoft.cz/procedure.php?cmd=saveDrinks',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Basic ' + btoa('coffe:kafe')
            },
            data: JSON.stringify(data),
            success: function(result) {
                alert('Formulář byl odeslán!');
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                if (xhr.responseText) {
                    try {
                        const err = JSON.parse(xhr.responseText);
                        if (typeof err === 'object' && err !== null && 'length' in err) {
                            console.error('Error details:', err);
                        } else {
                            console.error('Unexpected error format:', err);
                        }
                    } catch (e) {
                        console.error('Error parsing response:', e);
                    }
                } else {
                    console.error('No response text available.');
                }
            }
        });
    });


    $('#showResults').click(function() {
        $.ajax({
            url: 'http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa('coffe:kafe')
            },
            success: function(data) {
                const resultsDiv = $('#results');
                resultsDiv.html('<h3>Výsledky:</h3>');
    
               
                if (!Array.isArray(data)) {
                    resultsDiv.append('<p>Chyba při načítání výsledků.</p>');
                    console.error('Unexpected data format:', data);
                    return;
                }
    
                if (data.length === 0) {
                    resultsDiv.append('<p>Žádné výsledky k zobrazení.</p>');
                } else {

    
                    $.each(data, function(index, item) {
                        if (!Array.isArray(item) || item.length !== 3) {
                            console.error('Neplatná data pro záznam:', item);
                            return;
                        }
    
                        const drinkTypeId = item[0];
                        const quantity = item[1];
                        const userId = item[2];
    
    
                        resultsDiv.append(`<p>${userId} vypil ${quantity} ${drinkTypeId}</p>`);
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                console.log('XHR response:', xhr.responseText);
            }
        });
    });
    
    

    $('#showSummary').click(function() {
        const month = prompt('Zadejte číslo měsíce (1-12):', '9');
        if (month) {
            $.ajax({
                url: `http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks&month=${month}`,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Authorization': 'Basic ' + btoa('coffe:kafe')
                },
                success: function(data) {
                    console.log('Měsíční přehled data:', data); 
                    const summaryDiv = $('#summary');
                    summaryDiv.html('<h3>Měsíční přehled:</h3>');
    
                    if (!Array.isArray(data)) {
                        summaryDiv.append('<p>Chyba při načítání měsíčního přehledu.</p>');
                        console.error('Unexpected data format:', data);
                        return;
                    }
    
                    if (data.length === 0) {
                        summaryDiv.append('<p>Žádné výsledky k zobrazení.</p>');
                    } else {
                        const drinkNames = {
                            "Mléko": "Mléko",
                            "Espresso": "Espresso",
                            "Coffe": "Coffe",
                            "Long": "Long",
                            "Doppio+": "Doppio+"
                        };
    
                        const userNames = {
                            "Masopust Lukáš": "Masopust Lukáš",
                            "Molič Jan": "Molič Jan",
                            "Adamek Daniel": "Adamek Daniel",
                            "Weber David": "Weber David"
                        };
    
              
                        data.forEach(item => {
                            const drinkType = item[0];
                            const quantity = item[1];
                            const user = item[2];
    
                            const drinkName = drinkNames[drinkType] || drinkType; 
                            const userName = userNames[user] || user; 
    
                            summaryDiv.append(`<p>${userName} vypil ${quantity} ${drinkName} v měsíci ${month}</p>`);
                        });
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                }
            });
        }
    });
    
    
});
