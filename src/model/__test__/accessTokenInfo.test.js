import { getAccessToken, setAccessToken } from '../accessTokenInfo';

describe('Access Token Info Model', () => {
  it('Gettter and Setter should work', () => {
    setAccessToken('Message');
    const data = getAccessToken('Message');
    expect(data).toEqual('Message');
  });
});
