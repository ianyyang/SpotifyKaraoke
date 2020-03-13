## What is SpotifyKaraoke?
In the good old days of Spotify, lyrics would show up in real-time while listening to a song. Inexplicably, they removed this feature. Now we're here to *bring it back*.

SpotifyKaraoke is a web application powered by React.js that is meant to be run alongside your daily Spotify jam sessions. With its built-in web player, it gives you the option of kickstarting the music off your way. Music already playing? That works too! SpotifyKaraoke will automatically follow along with whatever enticing melodies you already have blasting in your room.

Once set up, SpotifyKaraoke will generate lyrics to whatever song you are playing in real-time, allowing you to transform a jam session to a mini karaoke session in your own home!

## The Technical Details

**Technologies Used: React.js, HTML, CSS, Spotify API, Genius API**

SpotifyKaraoke works by first making API calls to the Spotify RESTful API. It consumes the fetched JSON data to display your currently playing music as well as access your playlist library. After music playback has been established, it makes API calls to the Genius RESTful API, working similarly but in order to fetch JSON data that provides the lyrics to whatever song is currently playing.

React.js, HTML, and CSS bring it all together to build a front-end UI that the user interacts with to navigate around the SpotifyKaraoke app.
