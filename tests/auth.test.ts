import { signIn, signUp } from './auth';

describe('SignUp', () => {
  it('it signs up a user', async () => {
    const response = await helloTs({});
    expect(response).toMatchSnapshot();
    test(`Require valid data`, () => {
      const event = {};
      const context = {};

      const result = signIn(event, context);
      result
        .then(data => {
          expect(data).toBeFalsy();
        })
        .catch(e => {
          expect(e).toBe(
            `Missing required environment variables: BUCKET, REGION`
          );
        });
    });
  });
});
