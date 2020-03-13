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
import QueueMusicRoundedIcon from '@material-ui/icons/QueueMusicRounded';

// components
import SpotifyPlaylist from './spotifyplaylist';

// materialUI
const styles = theme => ({
    table: {
        minWidth: 650,
    },
});

class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '',
            current_song: [],
            current_artist: '',
            spotifyWebApi: this.props.app.spotifyWebApi
        }
    }

    componentWillMount() {
        this.getCurrentlyPlaying()
    }

    // get currently playing song
    getCurrentlyPlaying() {
        // song name, artist name(s)
        this.props.app.spotifyWebApi.getMyCurrentPlayingTrack().then((response) => {
            var getCurrentlyPlaying_json = response.item;
            var getCurrentlyPlaying_arr = [];
            var artists = [];
            var current_artist = '';

            // fetch artist(s) details (id, uri, name)
            Object.keys(getCurrentlyPlaying_json.artists).forEach((key) => {
                artists.push({
                    artist_id: getCurrentlyPlaying_json.artists[key].id,
                    artist_uri: getCurrentlyPlaying_json.artists[key].uri,
                    artist_name: getCurrentlyPlaying_json.artists[key].name
                })
            })

            // parse artists names into a single string
            Object.keys(artists).forEach((key) => {
                current_artist += artists[key].artist_name + ", "
            })

            // fetch track details (id, uri, name)
            getCurrentlyPlaying_arr.push({
                track_id: getCurrentlyPlaying_json.id,
                track_uri: getCurrentlyPlaying_json.uri,
                track_name: getCurrentlyPlaying_json.name,
                artists: artists
            })

            this.setState((state) => ({
                current_song: getCurrentlyPlaying_arr,
                current_artist: current_artist.slice(0, -2)
            }))
        })
    }

    // context: lyrics screen
    // user goes to playlist screen
    handleLyricsBackClick() {
        this.setState({ render: 'playlist' })
    }

    // render the lyrics of the currently playing song
    renderLyrics() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table" style={{ tableLayout: 'auto' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" width="10em">
                                <Link onClick={() => this.handleLyricsBackClick()}><QueueMusicRoundedIcon color="action" /></Link>
                            </TableCell>
                            {this.state.current_song.map((song) => (
                                <TableCell align="center">
                                    <Link href={song.track_uri}>{song.track_name} - {this.state.current_artist}</Link>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align="right" width="10em"></TableCell>
                        <TableCell align="center">WIP: Lyrics Here</TableCell>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    render() {
        switch (this.state.render) {
            default: return (
                <div>
                    {this.renderLyrics()}
                    {this.getCurrentlyPlaying()}
                </div>
            )
            case 'playlist': return <SpotifyPlaylist {...this.state} />
        }
    }
}

export default withStyles(styles)(Lyrics);