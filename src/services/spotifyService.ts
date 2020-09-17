'use strict';
import { fetchRetrySuccess } from '../util/apiCall';
export const getUserCurrentlyPlayingSpotify = async (spotifyRefreshToken: string): Promise<any> => {
    try {
      const response = await fetchRetrySuccess('https://api.spotify.com/v1/me/player', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${spotifyRefreshToken}`
        }
      });

      const data = response.body && response.status !== 204 ? await response.json() : null;
      
      const returnData = {
        statusCode: response.status,
        body: data,
      };
      return returnData;
    } catch (error) {
      throw error;
    }
};
