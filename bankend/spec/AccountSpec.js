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
/*        var driver = getNeo4jDriver();
        const session = driver.session();
        
        var balanceUserSrcName = "test_balance_src-at-kashyoo.com";
        var balanceUserDestName = "test_balance_dest-at-kashyoo.com";

        var result = null;
        if (!await userExists(session, balanceUserSrcName)) {
            result = await createUser(session, balanceUserSrcName);//with 7000
        }
        else {
            var newBalance = Account.updateBalance(balanceUserSrcName, 7000);
        }
        session.close();
        driver.close();
*/

        var srcUserName = "test_balance_dest-at-kashyoo.com";

        await Account.ensure_account_exists(srcUserName);
        var newBalance = Account.updateBalance(srcUserName, 5000);

        console.log("trying to transfer from " + srcUserName + " to " + "TEST2-at-kashyoo.com" + ", 30000");

        var returnedValue = Account.transferToAccount(srcUserName, "TEST2-at-kashyoo.com", 30000);

        expect (returnedValue).toEqual(4);
    });

});

