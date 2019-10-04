import { runWarm, getUserDetails, saveUserDetails } from './utils';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId : '...', // Your user pool id here
    ClientId : '...' // Your client id here
};
// Declare the userPool
const userPool = new CognitoUserPool(poolData);

// SignIn Function, we expect a valid User object
const SignIn: Function = async (event: AWSLambda.APIGatewayEvent) => {
  const authenticationData = {
      Username : 'email',
      Password : 'password',
  };
  var authenticationDetails = new AuthenticationDetails(authenticationData);

  var userData = {
      Username : 'email',
      Pool : userPool
  };

  var cognitoUser = new CognitoUser(userData);

  return cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result: any) {
          const accessToken = result.getAccessToken().getJwtToken();
          getUserDetails(cognitoUser);
          return accessToken;
      },

      onFailure: function(err) {
          alert(err.message || JSON.stringify(err));
      },

  });
};

// SignUp Function, we expect a valid User object
const SignUp: Function = async (event: AWSLambda.APIGatewayEvent) => {
  console.log(event)
  const attributeList = [];

  const dataEmail = {
      Name : 'email',
      Value : 'email@mydomain.com'
  };
  var attributeEmail = new CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);
  saveUserDetails(attributeList);
  return userPool.signUp('username', 'password', attributeList, [], function(err: any, result: any){
      if (err) {
          throw(err.message || JSON.stringify(err));
          return;
      }
      var cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());

      return cognitoUser;

  });
};

// Exports
module.exports.signIn = runWarm(SignIn)
module.exports.signUp = runWarm(SignUp)
