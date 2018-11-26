var neo4j = require('neo4j-driver').v1;

const neo4jUser = process.env.NEO4J_USER;
const neo4jPassword = process.env.NEO4J_PASSWORD;
const neo4jEndpoint = process.env.NEO4J_ENDPOINT;

const INITIAL_BALANCE = 7000;

function getNeo4jDriver()
{
        console.log("Connecting to neo4j");
        var driver = neo4j.driver(neo4jEndpoint, neo4j.auth.basic(neo4jUser, neo4jPassword));
        console.log("Created neo4j driver.");
        return driver;
}

/********************************************************************** */
// returns true/false whether account exists
/********************************************************************** */
async function userExists(session, username)
{
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' RETURN n.name");
    var isExists = (result.records.length >= 1);

    console.log("userExists for " + username + " result:" + isExists);
    return isExists; // true for success
}

/********************************************************************** */
// new user - new neo4j node
/********************************************************************** */
async function createUser(session, username)
{
    const result = await session.run("CREATE (n:User {name:'"+username+"', balance: "+INITIAL_BALANCE+" }) RETURN n");

    return result;
}

module.exports.get_balance_for_user = async (username) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' RETURN n");
    session.close();
    driver.close();

    if (result.records.length == 0) {
        return null;
    }

    record = result.records[0];
    // get value and transform from neo4j-style-numbers
    var curBalance = record._fields[0].properties.balance;
    /*
    if ('low' in curBalance) { // if Neo4j long object, take only number.
        curBalance = curBalance.low;
    }
    */
    console.log("getBalance result:" + curBalance);
    return Number(curBalance);
}

module.exports.ensure_account_exists = async (username) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    var result = null;
    if (!await userExists(session, username)) {
        result = await createUser(session, username);
    }
    else
    {
        result = "OK"; // not null - OK - successful.
    }

    session.close();
    driver.close();

    return result;
}

module.exports.updateBalance = async (username,balance) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' set n.balance = '"+ balance+ "' RETURN n");
    session.close();
    driver.close();

    if (result.records.length == 0) {
        return null;
    }

    record = result.records[0];
    newFunction();
    // get value and transform from neo4j-style-numbers
    var curBalance = record._fields[0].properties.balance;
  
    console.log("updateBalance result:" + curBalance);
    return Number(curBalance);
}

module.exports.updateBalance2 = async (username,srcBalance,dstBalance,sum,username2) => {
    var driver = getNeo4jDriver();
    const session = driver.session();
    const result = await session.run("Match (n:User) WHERE n.name='"+username+"' set n.balance = '"+srcBalance+ "' RETURN n");
    session.close();
    driver.close();
 
    var driver3 = getNeo4jDriver();
    const session3 = driver.session();
    const result3 = await session.run("Match (m:User) WHERE m.name='"+dstBalance+"' set m.balance = '"+dstBalance+ "' RETURN m");
    session3.close();
    driver3.close();

    var driver2 = getNeo4jDriver();
    const session2 = driver.session();
    const result2 = await session.run("CREATE (e:Event { Sum:'" +sum+"'}) return id(e)");
    session2.close();
    driver2.close();

    var driver1 = getNeo4jDriver();
    const session1 = driver.session();
    const result1 = await session.run("MATCH (u1:User),(u2:User),(e:Event) WHERE u1.name = "+username+" AND u2.name = "+username2+" AND id(e)='"+result2+"' create (u1)-[tf:TransferFrom]->(e), (e)-[tt:TransferTo]->(u2) RETURN u1,u2,e " );
    session1.close();
    driver1.close();




    if (result.records.length == 0) {
        return null;
    }

    record = result.records[0];
    newFunction();
    // get value and transform from neo4j-style-numbers
    var curBalance = record._fields[0].properties.balance;
  
    console.log("updateBalance result:" + curBalance);
    return Number(curBalance);
}
function newFunction() {
    console.log("updateBalance record:" + record);
}

module.exports.transferMoneyToAccount = async (srcUsername,dstUsername, sum) => {
  
    console.log("dstUsername="+dstUsername);
    console.log("sum="+sum);
  
    var srcAccount = await ensure_account_exists(srcUsername);
    if (srcAccount == null) {
      return  Number(1);
    }
    var  dstAccount = await ensure_account_exists(dstUsername);
    console.log("dstAccount="+dstAccount);
    if (dstAccount == null) {
      return Number(2);
    }
    
    var srcBalance = await Account.get_balance_for_user(srcUsername);
    console.log("srcBalance="+srcBalance);
    if(srcBalance>=sum)
    {
      var dstBalance = await Account.get_balance_for_user(dstUsername);
      console.log("dstBalance="+dstBalance);
      srcBalance=srcBalance - sum; 
      dstBalance=dstBalance + sum;    
  
      console.log("update srcBalance ="+dstBalance);
      srcBalance = await Account.updateBalance2(srcUsername,srcBalance,dstBalance,sum,dstUsername );
 /*     console.log("update dstBalance ="+dstBalance);
      dstBalance = await Account.updateBalance(dstUsername,dstBalance);
   */   
      return Number(3);
    }
    else
    {
      return Number(4);
    }
  };

