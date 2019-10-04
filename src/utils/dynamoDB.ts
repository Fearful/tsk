import * as AWS from 'aws-sdk'
import { User } from '../model/User'

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION || AWS.config.region || "us-east-1"
});

var dynamodb = new AWS.DynamoDB();

export const getUserDetails: Function = (user: User) => {
  dynamodb.getItem({
    TableName: "users",
    Key: {
      email: {
        S: "email"
      }
    },
    ConsistentRead: true
  }, function(err: any, data: any) {
    if (err) {
      throw err;
    }
    try {
      var result = JSON.parse(data.Item.result.S);
      console.log("%s:", data.Item.key.S, result);
    } catch (err) {
      throw err;
    }
  });
}

export const saveUserDetails: Function = (user: User) => {
  dynamodb.putItem({
    TableName: "users",
    Item: {
      key: {
        S: "email"
      },
      result: {
        S: JSON.stringify(user)
      }
    }
  }, function(err: any, data: any) {
    if (err) {
      throw err;
    }

    console.log("data:", data);
  });
}
