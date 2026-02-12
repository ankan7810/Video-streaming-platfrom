import mongoose, {isValidObjectId} from "mongoose"


const createPlaylist =async(req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
}

const getUserPlaylists =async(req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
}

const getPlaylistById =async(req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
}

const addVideoToPlaylist = async(req, res) => {
    const {playlistId, videoId} = req.params
}

const removeVideoFromPlaylist = async(req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

}

const deletePlaylist = async(req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
}

const updatePlaylist = async(req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
}

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
