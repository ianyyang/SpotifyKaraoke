// modules and libraries
import React, { Component } from 'react';

// materialUI (core and icons)
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import LibraryBooksRoundedIcon from '@material-ui/icons/LibraryBooksRounded';
import KeyboardBackspaceRoundedIcon from '@material-ui/icons/KeyboardBackspaceRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';

// components
import Lyrics from './lyrics';

// materialUI
const styles = theme => ({
    table: {
        minWidth: 650,
    },
});

class SpotifyPlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '',
            playlists: [],
            playlists_details: [],
            user_device: ''
        }
    }

    componentWillMount() {
        this.getUserPlaylists()
        this.getUserDevices()
    }

    // get current user's playlist
    getUserPlaylists() {
        // playlist: id, uri, name, track count
        // owner: id, uri, name
        this.props.spotifyWebApi.getUserPlaylists().then((response) => {
            var getUserPlaylists_json = response.items;
            var getUserPlaylists_arr = [];

            // iterate through user playlists, fetch general playlist information
            Object.keys(getUserPlaylists_json).forEach((key) => {
                getUserPlaylists_arr.push({
                    playlist_id: getUserPlaylists_json[key].id,
                    playlist_uri: getUserPlaylists_json[key].uri,
                    playlist_name: getUserPlaylists_json[key].name,
                    playlist_count: getUserPlaylists_json[key].tracks.total,
                    owner_id: getUserPlaylists_json[key].owner.id,
                    owner_uri: getUserPlaylists_json[key].owner.uri,
                    owner_name: getUserPlaylists_json[key].owner.display_name
                })
            })

            this.setState((state) => ({
                playlists: this.state.playlists.concat(getUserPlaylists_arr)
            }))
        })
    }

    // get users available devices
    getUserDevices() {
        this.props.spotifyWebApi.getMyDevices().then((response) => {
            var getUserDevices_json = response.devices;
            var activeUserDevice = '';

            // iterate through devices, find active device
            Object.keys(getUserDevices_json).forEach((key) => {
                if (getUserDevices_json[key].is_active === "true") {
                    activeUserDevice = getUserDevices_json[key].id
                }
            })

            // if no active devices found, use the first one (or do nothing if there are no devices)
            if (activeUserDevice === "") {
                if (getUserDevices_json.length > 0) {
                    activeUserDevice = getUserDevices_json[0].id
                }
            }

            this.setState((state) => ({
                user_device: activeUserDevice
            }))
        })
    }

    // get playlist info
    getPlaylistDetails(playlistID) {
        // track: id, uri, name
        // artist: id, uri, name
        this.props.spotifyWebApi.getPlaylist(playlistID).then((response) => {
            var getPlaylistDetails_json = response.tracks.items;
            var getPlaylistDetails_arr = [];

            // iterate through each playlist, fetch playlist details (tracks and artists)
            Object.keys(getPlaylistDetails_json).forEach((key) => {
                getPlaylistDetails_arr.push({
                    track_id: getPlaylistDetails_json[key].track.id,
                    track_uri: getPlaylistDetails_json[key].track.uri,
                    track_name: getPlaylistDetails_json[key].track.name,
                    artist_id: getPlaylistDetails_json[key].track.artists[0].id,
                    artist_uri: getPlaylistDetails_json[key].track.artists[0].uri,
                    artist_name: getPlaylistDetails_json[key].track.artists[0].name,
                })
            })

            this.setState((state) => ({
                playlists_details: getPlaylistDetails_arr
            }))
        })
    }

    // context: user's playlist screen
    // user goes to lyrics screen
    handlePlaylistBackClick() {
        this.setState((state) => ({
            render: 'lyrics'
        }))
    }

    // context: user's playlist screen
    // set playback to the given playlist
    handlePlayPlaylistClick(playlistURI) {
        if (this.state.user_device !== "") {
            this.props.spotifyWebApi.play({ device_id: this.state.user_device, context_uri: playlistURI })
        }
    }

    // context: user's playlist screen
    // user clicks on a specific playlist
    handlePlaylistClick(playlistID) {
        this.getPlaylistDetails(playlistID)

        this.setState((state) => ({
            render: 'playlists_details'
        }))
    }

    // render the playlists of the current user
    renderPlaylists() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" width="10em">
                                <Link onClick={() => this.handlePlaylistBackClick()}><LibraryBooksRoundedIcon color="action" /></Link>
                            </TableCell>
                            <TableCell align="left">Playlist Name</TableCell>
                            <TableCell align="center">Track Count</TableCell>
                            <TableCell align="center">Playlist Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.playlists.map((playlist) => (
                            <TableRow key={playlist.playlist_name}>
                                <TableCell align="right" width="10em">
                                    <Link onClick={() => this.handlePlayPlaylistClick(playlist.playlist_uri)}><PlayCircleOutlineRoundedIcon color="action" /></Link>
                                </TableCell>
                                <TableCell align="left">
                                    <Link onClick={() => this.handlePlaylistClick(playlist.playlist_id)}>{playlist.playlist_name}</Link>
                                </TableCell>
                                <TableCell align="center">
                                    {playlist.playlist_count}
                                </TableCell>
                                <TableCell align="center">
                                    <Link href={playlist.owner_uri}>{playlist.owner_name} ({playlist.owner_id})</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    // context: playlist details screen
    // user goes back to the user's playlists screen
    handlePlaylistDetailsBackClick() {
        this.setState((state) => ({
            render: ''
        }))
    }

    // context: playlist details screen
    // set playback to the given song
    handlePlayTrackClick(trackURI) {
        if (this.state.user_device !== "") {
            this.props.spotifyWebApi.play({ device_id: this.state.user_device, uris: [trackURI] })
        }
    }

    // render the playlist details (tracks and artists) of a selected playlist
    renderPlaylist() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table" style={{ tableLayout: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" width="10em">
                                <Link onClick={() => this.handlePlaylistDetailsBackClick()}><KeyboardBackspaceRoundedIcon color="action" /></Link>
                            </TableCell>
                            <TableCell align="left">Track Title</TableCell>
                            <TableCell align="center">Track Artist</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.playlists_details.map((playlist_detail) => (
                            <TableRow>
                                <TableCell align="right" width="10em">
                                    <Link onClick={() => this.handlePlayTrackClick(playlist_detail.track_uri)}><PlayCircleOutlineRoundedIcon color="action" /></Link>
                                </TableCell>
                                <TableCell align="left">
                                    <Link href={playlist_detail.track_uri}>{playlist_detail.track_name}</Link>
                                </TableCell>
                                <TableCell align="center">
                                    <Link href={playlist_detail.artist_uri}>{playlist_detail.artist_name}</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    render() {
        switch (this.state.render) {
            default: return (
                <div>
                    {this.renderPlaylists()}
                </div>
            )
            case 'playlists_details': return (
                <div>
                    {this.renderPlaylist()}
                </div>
            )
            case 'lyrics': return <Lyrics app={this.props} playlist={this.state} />
        }
    }
}

export default withStyles(styles)(SpotifyPlaylist);
