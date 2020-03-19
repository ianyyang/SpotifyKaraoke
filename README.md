## What is SpotifyKaraoke?
In the good old days of Spotify, lyrics would show up in real-time while listening to a song. Inexplicably, they removed this feature. Now we're here to *bring it back*.

SpotifyKaraoke is a web application powered by React.js that is meant to be run alongside your daily Spotify jam sessions. With its built-in web player, it gives you the option of kickstarting the music off your way. Music already playing? That works too! SpotifyKaraoke will automatically follow along with whatever enticing melodies you already have blasting in your room.

Once set up, SpotifyKaraoke will generate lyrics to whatever song you are playing in real-time, allowing you to transform a jam session to a mini karaoke session in your own home!

## The Technical Details

**Technologies Used: React.js, HTML, CSS, Spotify API, Genius API**

SpotifyKaraoke works by first making API calls to the Spotify RESTful API. It consumes the fetched JSON data to display your currently playing music as well as access your playlist library. After music playback has been established, it makes API calls to the Genius RESTful API, working similarly.

However, since there is no direct API endpoint for song lyrics, JSON data that provides the full [Genius.com](https://genius.com/) URL for the currently playing song is fetched instead. [Node-fetch](https://github.com/node-fetch/node-fetch) is used to scrape the HTML data from the Genius URL, and [cheerio](https://github.com/cheeriojs/cheerio) is used to parse the data for the lyrics.

React.js, HTML, and CSS bring it all together to build a front-end UI that the user interacts with to navigate around the SpotifyKaraoke app.
