import { router } from '../trpc.js';
import { loginRoute, registerRoute, googleLoginRoute } from './user/user-routes.js';
import { createSessionsRoute, deleteItemRoute, deleteSessionsRoute, getSessionDataRoute, getUserSessionsRoute, restartSessionsRoute, undoChoiceRoute, undoDeleteItemRoute, userChoiceRoute } from './session/session-routes.js';
import { anilistCharactersByFavouritesListQueryRoute, anilistCharactersByIdsQueryRoute, anilistMediaByFavouritesListQueryRoute, anilistMediaByIdsQueryRoute, anilistMediaByUserListQueryRoute, anilistStaffByFavouritesListQueryRoute, anilistStaffByIdsQueryRoute, getAnilistCharactersFromDbRoute, getAnilistMediaFromDbRoute, getAnilistStaffFromDbRoute } from './loader/anilist/anilist-routes.js';
import { getSpotifyArtistsFromDbRoute, getSpotifySongsFromDbRoute, spotifySongsByPlaylistQueryRoute } from './loader/spotify/spotify-routes.js';

export const appRouter = router({
    user: router({
        login: loginRoute,
        register: registerRoute,
        googleLogin: googleLoginRoute
    }),
    session: router({
        sessionManagement: router({
            getUserSessions: getUserSessionsRoute,
            createSession: createSessionsRoute,
            restartSessions: restartSessionsRoute,
            deleteSession: deleteSessionsRoute
        }),
        sessionInteraction: router({
            getSessionData: getSessionDataRoute,
            userChoice: userChoiceRoute,
            undoChoice: undoChoiceRoute,
            deleteItem: deleteItemRoute,
            undoDeleteItem: undoDeleteItemRoute
        })
    }),
    sortable: router({
        dataLoaders: router({
            anilist: router({
                charactersByFavouritesList: anilistCharactersByFavouritesListQueryRoute,
                charactersByIds: anilistCharactersByIdsQueryRoute,
                staffByFavouritesList: anilistStaffByFavouritesListQueryRoute,
                staffByIds: anilistStaffByIdsQueryRoute,
                mediaByUserList: anilistMediaByUserListQueryRoute,
                mediaByFavouritesList: anilistMediaByFavouritesListQueryRoute,
                mediaByIds: anilistMediaByIdsQueryRoute
            }),
            spotify: router({
                songsByPlaylist: spotifySongsByPlaylistQueryRoute
            })
        }),
        sessionItems: router({
            anilist: router({
                characters: getAnilistCharactersFromDbRoute,
                staff: getAnilistStaffFromDbRoute,
                media: getAnilistMediaFromDbRoute
            }),
            spotify: router({
                songs: getSpotifySongsFromDbRoute,
                artists: getSpotifyArtistsFromDbRoute
            })
        })
    })
});

export type AppRouter = typeof appRouter;
