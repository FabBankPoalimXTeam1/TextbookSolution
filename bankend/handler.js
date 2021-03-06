'use strict';

const Account = require('./account');

function getCognitoUser(event, context) {
  if (!event.requestContext.authorizer) {
        console.log("error in auth");
        return null;
  }

  // Because we're using a Cognito User Pools authorizer, all of the claims
  // included in the authentication token are provided in the request context.
  // This includes the username as well as other attributes.
  var callingUsername = event.requestContext.authorizer.claims['cognito:username'];

  console.log("getCognitoUser=" + callingUsername);
  return callingUsername;

}

function buildReturnJSON(status,body) {
  return {
    statusCode: status,
    headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
    body: body
  };
}
module.exports.hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.getaccountbalance = async (event, context) => {
  var username = getCognitoUser(event, context);
  var balance = await Account.get_balance_for_user(username);

  return buildReturnJSON(
    200, 
    JSON.stringify({
      input: event,
      username: username,
      CurrentBalance: balance,
    })
  );
};

module.exports.transferToAccount = async (event, context) => {
  var srcUsername = getCognitoUser(event, context);
 
  console.log("body="+event.body);

  console.log("event-Json"+event.JSON);
  
  var obj = JSON.parse(event.body);

  var dstUsername = obj.dstusername;
  var sum = parseFloat(obj.sum);


  console.log("dstUsername="+dstUsername);
  console.log("sum="+sum);

  var retCode = await Account.transferMoneyToAccount(srcUsername,dstUsername,sum);

  switch (retCode) {
    case 1:
    return  buildReturnJSON(
      500,
      JSON.stringify({
        input: event,
        username: srcUsername,
        msg: "could not ensure user exists"
      }));
    case 2:
    return buildReturnJSON(
      500,
      JSON.stringify({
        input: event,
        username: dstUsername,
        msg: "could not ensure user exists"
      }));
    case 3:
    return buildReturnJSON(
      200, 
      JSON.stringify({
        input: event,
        sum: sum,
        msg: "Transfer Success",
      }));
     case 4:
     return buildReturnJSON(
      500,
      JSON.stringify({
       // input: event,
       // username: srcBalance,
        msg: "Balance Error"
      }));
    default:
    return buildReturnJSON(
      500,
      JSON.stringify({
       // input: event,
       // username: srcBalance,
        msg: "default Balance Error"
      }));
  }

 
};


module.exports.ensureuserexists = async (event, context) => {
  var username = getCognitoUser(event, context);
  var account = await Account.ensure_account_exists(username);

  if (account == null) {
    return buildReturnJSON(
      500,
      JSON.stringify({
        input: event,
        username: username,
        msg: "could not ensure user exists"
      })
    )
  } else {
    return buildReturnJSON(
      200,
      JSON.stringify({
        input: event,
        username: username,
      })
    );
  }
};



/*
module.exports.transferToAccount = async (event, context) => {
  var srcUsername = getCognitoUser(event, context);
 
  console.log("body="+event.body);

  console.log("event-Json"+event.JSON);
  
  var obj = JSON.parse(event.body);

  var dstUsername = obj.dstusername;
  var sum = parseFloat(obj.sum);

  var temp = JSON.stringify({
    input: event,
    event: event,
    msg: "could not ensure user exists"
  })

  console.log("temp="+temp);

  console.log("dstUsername="+dstUsername);
  console.log("sum="+sum);

  var srcAccount = await Account.ensure_account_exists(srcUsername);
  if (srcAccount == null) {
    return  buildReturnJSON(
      500,
      JSON.stringify({
        input: event,
        username: srcUsername,
        msg: "could not ensure user exists"
      })
    )
  }
  var  dstAccount = await Account.ensure_account_exists(dstUsername);
  console.log("dstAccount="+dstAccount);
  if (dstAccount == null) {
    return buildReturnJSON(
      500,
      JSON.stringify({
        input: event,
        username: dstUsername,
        msg: "could not ensure user exists"
      })
    )
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
    srcBalance = await Account.updateBalance(srcUsername,srcBalance);
    console.log("update dstBalance ="+dstBalance);
    dstBalance = await Account.updateBalance(dstUsername,dstBalance);
    return buildReturnJSON(
      200, 
      JSON.stringify({
        input: event,
        srcBalance: srcBalance,
        dstBalance: dstBalance,
      })
    );
  }
  else
  {
    return buildReturnJSON(
      500,
      JSON.stringify({
       // input: event,
       // username: srcBalance,
        msg: "Balance Error"
      })
    )
  }
};
*/