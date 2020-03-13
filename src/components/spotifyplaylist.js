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

// materialUI
const styles = theme => ({
    table: {
        minWidth: 650,
    },
});

class SpotifyPlaylist extends Component {
    constructor() {
        super();
        this.state = {
            render: '',
            playlists: [],
            playlists_details: []
        }
    }

    componentWillMount() {
        this.getUserPlaylists()
    }

    // get current user's playlist
    getUserPlaylists() {
        // playlist: id, uri, name, track count
        // owner: id, uri, name
        this.props.spotifyWebApi.getUserPlaylists().then((response) => {
            var getUserPlaylists_json = response.items;
            var getUserPlaylists_arr = [];

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

    // get playlist info
    getPlaylistDetails(playlistID) {
        // track: id, uri, name
        // artist: id, uri, name
        this.props.spotifyWebApi.getPlaylist(playlistID).then((response) => {
            var getPlaylist_json = response.tracks.items;
            var getPlaylist_arr = [];

            Object.keys(getPlaylist_json).forEach((key) => {
                getPlaylist_arr.push({
                    track_id: getPlaylist_json[key].track.id,
                    track_uri: getPlaylist_json[key].track.uri,
                    track_name: getPlaylist_json[key].track.name,
                    artist_id: getPlaylist_json[key].track.artists[0].id,
                    artist_uri: getPlaylist_json[key].track.artists[0].uri,
                    artist_name: getPlaylist_json[key].track.artists[0].name,
                })
            })

            this.setState((state) => ({
                playlists_details: getPlaylist_arr
            }))
        })
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
                            <TableCell align="center">Playlist Name</TableCell>
                            <TableCell align="center">Track Count</TableCell>
                            <TableCell align="center">Playlist Owner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.playlists.map((playlist) => (
                            <TableRow key={playlist.playlist_name}>
                                <TableCell align="center"><Link onClick={() => this.handlePlaylistClick(playlist.playlist_id)}>{playlist.playlist_name}</Link></TableCell>
                                <TableCell align="center">{playlist.playlist_count}</TableCell>
                                <TableCell align="center"><Link href={playlist.owner_uri}>{playlist.owner_name} ({playlist.owner_id})</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    // context: playlist details screen
    // user goes back to the user's playlists screen
    handleBackClick() {
        this.setState((state) => ({
            render: ''
        }))
    }

    // context: playlist details screen
    // user confirmed this playlist to be converted
    handleConfirmClick() {
        console.log("Save playlist")
    }

    // render the playlist details (tracks and artists) of a selected playlist
    renderPlaylist() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table" style={{tableLayout: 'auto'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><Link onClick={() => this.handleBackClick()}>Back</Link> | <Link onClick={() => this.handleConfirmClick()}>Confirm</Link></TableCell>
                            <TableCell align="center">Track Title</TableCell>
                            <TableCell align="center">Track Artist</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.playlists_details.map((playlist_detail) => (
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="center"><Link href={playlist_detail.track_uri}>{playlist_detail.track_name}</Link></TableCell>
                                <TableCell align="center"><Link href={playlist_detail.artist_uri}>{playlist_detail.artist_name}</Link></TableCell>
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
        }
    }
}

export default withStyles(styles)(SpotifyPlaylist);
