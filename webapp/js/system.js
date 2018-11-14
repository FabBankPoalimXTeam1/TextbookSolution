var BankApp = window.BankApp || {};
BankApp.map = BankApp.map || {};

var authToken;

// on login and on refreshing page, need the TOKEN ready to do actions.
function loadLoginInfo() {
    BankApp.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            $('.authToken').text(token);
            ensureUserExists(); // in background, ensure the user acct exists in the neo4j db.
        } else {
            window.location.href = '/index.html';
        }
    }).catch(function handleTokenError(error) {
        alert("error in auth " + error);
        window.location.href = '/index.html';
    });
}

// show user's current balance in account
function getBalance() {
    console.log("getting balance with token " + authToken);
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + "/getaccountbalance",
        headers: {
            Authorization: authToken
        },
        contentType: 'application/json',
        success: successGetBalance,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting balance: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('error getting balance ' + jqXHR.responseText);
        }
    });
}

// show result after JSON returns
function successGetBalance(result) {
    console.log("getting balance event finished. result: ")
    console.log(result);
    alert("Your balance is " + result.CurrentBalance);
}

// ensure an account exists
function ensureUserExists() {
    console.log("ensuring user exists with token " + authToken);
    $.ajax({
        method: 'POST',                     
        url: _config.api.invokeUrl + "/ensureuserexists",           
        headers: {
            Authorization: authToken
        },
        contentType: 'application/json',
        success: successEnsureUserExists,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
        console.error('Error ensuring user exists: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('error ensuring user exists ' + jqXHR.responseText);
        }
    });
}

// show result after JSON returns
function successEnsureUserExists(result) {
    console.log("ensure user exists finished. result: ")
    console.log(result);
}

// handle auth if in system - useful when refreshing page to reload token.
if  ((window.location.href.indexOf("bank-system-logged-in") > -1)) {
    console.log("logged in screen, loading auth creds");
    loadLoginInfo();

}


// show user's current balance in account
function transferToAccount() {
    console.log("getting transferToAccount   " + authToken);
   var dstusername =  $('.dst-user-name').val();
   var sum=  $('.sum').val();
    $.ajax({
        method: 'POST',
        url: _config.api.invokeUrl + "/transferToAccount",
        headers: {
            Authorization: authToken
        },
        data: jQuery.param({ dstusername: dstusername, sum : sum}) ,
        contentType: 'application/json',
        success: successTransferToAccount,
        error: function ajaxError(jqXHR, textStatus, errorThrown) {
        console.error('Error requesting balance: ', textStatus, ', Details: ', errorThrown);
        console.error('Response: ', jqXHR.responseText);
        alert('error getting transferToAccount ' + jqXHR.responseText);
        }
    });
}

// show result after JSON returns
function successTransferToAccount(result) {
    console.log("successTransferToAccount: ")
    console.log(result);
    alert("Your srcBalance is " + result.srcBalance);
    alert("Your dstBalance is " + result.dstBalance);
}
