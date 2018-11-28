const Account = require('../account');
const Handler = require('../handler');

describe("Account", function() {
    beforeAll(async function() {
        await Account.ensure_account_exists("TEST2-at-kashyoo.com");
    });

    it("return null when username does not exist", async function() {
        var balance = await Account.get_balance_for_user("nonexist");
	expect (balance).toEqual(null);
    });

    xit("return 200 for test user", async function() {
        var balance = await Account.get_balance_for_user("TEST2-at-kashyoo.com");
	expect (balance).toEqual(200);
    });
    xit("return 200 for test user", async function() {
        var balance = await Account.updateBalance("TEST2-at-kashyoo.com",200)
	expect (balance).toEqual(200);
    });

    it("return the right error code when no balance at the customer account", async function() {

        var srcUserName = "test_balance_src-at-kashyoo.com";
        var dstUserName = "TEST2-at-kashyoo.com";

        var success = await Account.ensure_account_exists(srcUserName);
        console.log("TEST: is account src exist: " + success);

        var success2 = await Account.ensure_account_exists(dstUserName);
        console.log("TEST: is account dest exist: " + success2);

        var newBalance = Account.updateBalance(srcUserName, 5000);
        console.log("TEST: new balance: " + newBalance);

        console.log("TEST: trying to transfer from " + srcUserName + " to " + dstUserName + ", 30000");

        var returnedValue = Account.transferMoneyToAccount(srcUserName, dstUserName, 30000);
        var json = JSON.stringify({
            input: returnedValue
          })
          
        console.log("TEST: transfer: " + json);

        expect (returnedValue).toEqual("4");
    });

});

