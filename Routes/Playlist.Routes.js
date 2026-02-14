import express from "express"
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists,
     removeVideoFromPlaylist, updatePlaylist } from "../Controllers/Playlist.Controllers.js";
import isAuth from "../Middlewares/isAuth.js";

const playlistrouter = express.Router();
playlistrouter.post("/create",isAuth,createPlaylist)
playlistrouter.get("/get/:id",isAuth,getUserPlaylists)
playlistrouter.get("/getbyid/:id",isAuth,getPlaylistById)
playlistrouter.post("/addvideo/:id",isAuth,addVideoToPlaylist)
playlistrouter.delete("/removevideo/:id",isAuth,removeVideoFromPlaylist)
playlistrouter.delete("/deleteplaylist/:id",isAuth,deletePlaylist)
playlistrouter.put("/updateplaylist/:id",isAuth,updatePlaylist)

export default playlistrouter;