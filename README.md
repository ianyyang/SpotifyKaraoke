## What is SpotifyKaraoke? 🎤
In the good old days of Spotify, lyrics would show up in real-time while listening to a song. Inexplicably, they removed this feature. Now we're here to *bring it back*.

SpotifyKaraoke is a web application powered by React.js that is meant to be run alongside your daily Spotify jam sessions. With its built-in web player, it gives you the option of kickstarting the music off your way. Music already playing? That works too! SpotifyKaraoke will automatically follow along with whatever enticing melodies you already have blasting in your room.

Once set up, SpotifyKaraoke will generate lyrics to whatever song you are playing in real-time, allowing you to transform a jam session to a mini karaoke session in your own home!

## The Technical Details

**Technologies Used: React.js, HTML, CSS, Spotify API, Genius API**

SpotifyKaraoke works by first making API calls to the **Spotify RESTful API**. It consumes the fetched JSON data to display your currently playing music as well as access your playlist library. After music playback has been established, it makes API calls to the **Genius RESTful API**, working similarly.

However, since there is no direct API endpoint for song lyrics, JSON data that provides the full [Genius.com](https://genius.com/) URL for the currently playing song is fetched instead. [Node-fetch](https://github.com/node-fetch/node-fetch) is used to scrape the HTML data from the Genius URL, and [cheerio](https://github.com/cheeriojs/cheerio) is used to parse the data for the lyrics.

**React.js**, **HTML**, and **CSS** bring it all together to build a front-end UI that the user interacts with to navigate around the SpotifyKaraoke app.

## Installation & Usage

#### 1. Clone repository
```
git clone https://github.com/ianyyang/SpotifyKaraoke.git
cd SpotifyKaraoke
```

#### 2. Install dependencies & run
```
npm install
npm run-script karaoke
```

#### 3. Allow CORS (Optional)

In the case that your browser (most likely Chrome or Safari) is not showcasing any lyrics, there's a good chance that it is being blocked by CORS (cross-origin resource sharing) policy. Bypassing it is essential to be able to pull lyrical data from the Genius website.

You can learn how to disable this policy for [Chrome](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome) or [Safari](https://stackoverflow.com/questions/4556429/disabling-same-origin-policy-in-safari).
