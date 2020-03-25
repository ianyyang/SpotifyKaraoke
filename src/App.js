// modules and libraries
import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';

// materialUI
import Button from '@material-ui/core/Button';

// components
import SpotifyPlaylist from './components/spotifyplaylist';

// css
import './App.css';

class App extends Component {
    constructor() {
        super();

        // Spotify authentication + log in
        const params = this.getHashParams();
        const WebApi = new Spotify();

        this.state = {
            render: '',
            // context: Spotify authentication + log in
            spotifyLoggedIn: params.access_token ? true : false,
            spotifyWebApi: WebApi,
        }

        // context: Spotify authentication + log in
        if (params.access_token) {
            this.state.spotifyWebApi.setAccessToken(params.access_token);
        }
    }

    componentWillMount() {
        // context: after Spotify authentication (localhost:8888), user redirected to App (localhost:3333)
        // check if Spotify is logged in, to automatically redirect to post-login component
        if (this.state.spotifyLoggedIn) {
            this.setState({ render: 'loggedin' })
        }
    }

    handleSpotifyLoginClick() {
        this.setState({ render: 'login' })
    }

    // context: Spotify authentication + log in
    // parses the hash string from the Spotify access token
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    render() {
        switch (this.state.render) {
            default: return (
                <div className="App">
                    <Button className="LoginButton" variant="contained" onClick={() => this.handleSpotifyLoginClick()}>Spotify Login</Button>
                </div>
            )
            case 'login': window.location.assign('http://localhost:8888/login')
            /* falls through */
            case 'loggedin': return <SpotifyPlaylist {...this.state} />
        }
    }
}

export default App;
