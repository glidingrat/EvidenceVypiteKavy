document.getElementById('sendDataButton').addEventListener('click', function() {
    // Data, která se mají odeslat na server
    const data = {
        user: '1',  // Příklad ID uživatele
        Coffe: 2,   // Příklad nápoje: 2 šálky kávy
        Long: 1     // Příklad nápoje: 1 šálek Long coffee
    };

    // Odeslání dat pomocí fetch
    fetch('http://ajax1.lmsoft.cz/procedure.php?cmd=saveDrinks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('coffe:kafe')  // Autentizace pomocí Basic Auth
        },
        body: JSON.stringify(data)  // Převod objektu na JSON řetězec
    })
    .then(response => response.json())  // Získání odpovědi jako JSON
    .then(data => {
        console.log('Úspěch:', data);
        alert('Data byla úspěšně odeslána na server.');
    })
    .catch((error) => {
        console.error('Chyba:', error);
        alert('Chyba při odesílání dat.');
    });
});
