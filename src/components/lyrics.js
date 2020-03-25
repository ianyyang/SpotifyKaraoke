// modules and libraries
import React, { Component } from 'react';
import Genius from 'genius-api';
import cheerio from 'cheerio';
import { throttle } from 'lodash';

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
import AutorenewRoundedIcon from '@material-ui/icons/AutorenewRounded';

// components
import SpotifyPlaylist from './spotifyplaylist';

// materialUI
const styles = theme => ({
    table: {
        minWidth: 650,
    },
});

// genius API
const geniusApi = 'u45YWR610PNuGXc3J0eGfQ05XPAmfKcvvbxKtCsaWpQaNLN7sdoNBcRN4I_cTTG-';
const genius = new Genius(geniusApi);

// node-fetch
const fetch = require('node-fetch');

class Lyrics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            render: '',
            // spotify API
            current_song: [],
            current_artist: '',
            song_title: '',
            artist_name: '',
            // genius API 
            genius_url: '',
            current_lyrics: '',
            spotifyWebApi: this.props.app.spotifyWebApi
        }

        this.getCurrentlyPlayingThrottled = throttle(this.getCurrentlyPlaying, 1000)
        this.getLyricsThrottled = throttle(this.getLyrics, 1000)
    }

    // force a refresh for the currently playing song and its lyrics
    forceRefresh() {
        this.getCurrentlyPlaying()
        this.getSongUrl()
        this.getHtmlFromUrl()
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
                current_artist: current_artist.slice(0, -2),
                song_title: getCurrentlyPlaying_json.name,
                artist_name: artists[0].artist_name
            }))
        })
    }
    
    // get lyrics for the currently playing song
    getLyrics() {
        this.getSongUrl()
        this.getHtmlFromUrl()
    }

    // get genius url for the currently playing song
    getSongUrl() {
        console.log("Getting song URL")
        var searchTerms = this.state.song_title + ' by ' + this.state.artist_name

        genius.search(searchTerms).then((response) => {
            var getSongUrl_json = response.hits;

            // fetch genius url
            Object.keys(getSongUrl_json).forEach((key) => {
                // check if result type is for a song
                if (getSongUrl_json[key].type === 'song') {
                    // check if result song and artist match 
                    if (getSongUrl_json[key].result.title === this.state.song_title &&
                        getSongUrl_json[key].result.primary_artist.name === this.state.artist_name) {
                        this.setState((state) => ({
                            genius_url: getSongUrl_json[key].result.url
                        }))
                    }
                }
            })
        })
    }

    // download html from url
    getHtmlFromUrl() {
        console.log("Downloading HTML from song URL")
        return fetch(this.state.genius_url, { method: 'GET', })
            .then(response => response.text())
            .then(body => this.parseSongHtml(body))
    }

    // parse song's html
    parseSongHtml(htmlText) {
        console.log("Parsing HTML from song URL")
        const $ = cheerio.load(htmlText)
        const lyrics = $('.lyrics').text()

        this.setState((state) => ({
            current_lyrics: lyrics.substr(15).replace(/\n/gi, '<br>')
        }))
    }

    // render the lyrics of the currently playing song
    renderLyrics() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.current_lyrics }} />
        )
    }

    // user goes to playlist screen
    handleLyricsBackClick() {
        this.setState({ render: 'playlist' })
    }

    // render the table
    renderTable() {
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
                                    <Link href={song.track_uri}>{song.track_name} - {this.state.current_artist} </Link>
                                    <Link onClick={() => this.forceRefresh()}><AutorenewRoundedIcon color="action" style={{ fontSize: 15 }} /></Link>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableCell align="right" width="10em"></TableCell>
                        <TableCell align="center">{this.renderLyrics()}</TableCell>
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    render() {
        switch (this.state.render) {
            default: return (
                <div>
                    {this.renderTable()}
                    {this.getCurrentlyPlayingThrottled()}
                    {this.getLyricsThrottled()}
                </div>
            )
            case 'playlist': return <SpotifyPlaylist {...this.state} />
        }
    }
}

export default withStyles(styles)(Lyrics);
