import { router } from '../trpc.js';
import { loginRoute, registerRoute, googleLoginRoute } from './user/user-routes.js';
import { createSessionsRoute, deleteItemRoute, deleteSessionsRoute, getSessionDataRoute, getUserSessionsRoute, restartSessionsRoute, undoChoiceRoute, undoDeleteItemRoute, userChoiceRoute } from './session/session-routes.js';
import { anilistCharactersByFavouritesListQueryRoute, anilistCharactersByIdsQueryRoute, anilistMediaByFavouritesListQueryRoute, anilistMediaByIdsQueryRoute, anilistMediaByUserListQueryRoute, anilistStaffByFavouritesListQueryRoute, anilistStaffByIdsQueryRoute } from './loader/anilist/anilist-routes.js';
import { spotifyArtistsByIdsQueryRoute, spotifySongsByAlbumQueryRoute, spotifySongsByIdsQueryRoute, spotifySongsByPlaylistQueryRoute } from './loader/spotify/spotify-routes.js';
import { steamGamesByUserLibraryQueryRoute } from './loader/steam/steam-routes.js';
import { createGenericItemsQueryRoute } from './loader/generic/generic-routes.js';
import { getSortableItemsForSession } from './loader/loader-routes.js';

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
            generic: createGenericItemsQueryRoute,
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
                songsByPlaylist: spotifySongsByPlaylistQueryRoute,
                songsByAlbum: spotifySongsByAlbumQueryRoute,
                songsByIds: spotifySongsByIdsQueryRoute,
                artistsByIds: spotifyArtistsByIdsQueryRoute
            }),
            steam: router({
                gamesByUserLibrary: steamGamesByUserLibraryQueryRoute
            })
        }),
        sessionItems: getSortableItemsForSession
    })
});

export type AppRouter = typeof appRouter;
