'use strict';
import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';
import { getUserCurrentlyPlayingSpotify } from '../services/spotifyService';
import { getSpotifyBearerToken } from '../util/spotifyToken';
import { urlToBase64 } from '../util/urlConversion';

const generateViewData = async (data: any) => {
  const artistString = (data.item.artists || []).map((elem: any) => elem.name).join(', ');
  const correctSizedImages = (data.item.album.images || []).filter((elem: any) => elem.height === 300 && elem.width === 300);
  const sizedCoverImgUrl = correctSizedImages.length > 0 ? correctSizedImages[0].url : null;
  const coverImgBase64 = sizedCoverImgUrl ? await urlToBase64(sizedCoverImgUrl) : null;

  return {
    height: 450,
    title: data.is_playing ? 'Now playing' : 'Recently played',
    link: data.context.external_urls.spotify,
    artists: artistString,
    coverImageBase64: coverImgBase64 ? `data:image/png;base64,${coverImgBase64}` : null,
    songName: data.item.name,
    currentlyPlaying: true
  };
};

export const getCurrentlyPlayingSongSvg = async (req: Request, res: Response, next: NextFunction) => {
  let viewData: any = {
    height: 40,
    currentlyPlaying: false
  };

  try {
    const spotifyToken = await getSpotifyBearerToken();
    const response = await getUserCurrentlyPlayingSpotify(spotifyToken);

    if (response.body) {
      viewData = await generateViewData(response.body);
    }
  } catch (exception) {
    logger.error(exception);
  } finally {
    res.contentType('image/svg+xml');
    res.render('current-song', {
      data: viewData,
      layout: false
    });
  }
};
