
import axios from 'axios';
import process from 'node:process';

let accessToken = '';
let tokenRequest = null;


// Fetch an OAuth token from Twitch
async function getTwitchToken() {
  if (tokenRequest) {
    return tokenRequest
  }

  tokenRequest = (async () => {
    try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        timeout: 10000,
        params: {
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          grant_type: 'client_credentials',
        },
      }
    );

    accessToken = response.data.access_token;
    console.log('Successfully retrieved new Twitch Access Token!');

    return accessToken;
  } catch (error) {
    console.error(
      'Error fetching Twitch token:',
      error.response?.data || error.message
    );

    throw error;
  } finally {
    tokenRequest = null;
  }
  })();


  return tokenRequest;
}


// Send a request to IGDB
async function igdbRequest(endpoint, query) {
  if (!accessToken) {
    try {
      await getTwitchToken();
    } catch (error) {
      throw new Error('Twitch authentication failed', {
        cause: error,
      });
    }
  }

  const makeReq = () => {
    return axios.post(
      `https://api.igdb.com/v4/${endpoint}`,
      query,
      {
        timeout: 10000,
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'text/plain',
        },
      }
    );
  };

  try {
    const response = await makeReq();
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        await getTwitchToken();
      } catch (refreshError) {
        throw new Error('Failed to refresh Twitch access token', {
          cause: refreshError,
        });
      }

      const retryResponse = await makeReq();
      return retryResponse.data;
    }

    throw error;
  }
}

export { igdbRequest };
