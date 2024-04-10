import '../CSS/Track.css'
import moment from 'moment'

export default function Track(props) {
  let track = props.track
  let index = props.index
  let dateAdded = props.track.added_at
  let artistsStr = artistsString([...track.track.artists])

  return (
    <div role="row" aria-rowindex={index + 2} aria-selected="false">
      <div className="GridSpacing GridSizing" role="presentation">
        <div className="PlaylistIndexSpacing" role="gridcell" aria-colindex="1" tabIndex="-1">
          <div className="PlaylistIndex">
            <div>{index + 1}</div>
          </div>
        </div>
        <div className="PlaylistTitle" role="gridcell" aria-colindex="2" tabIndex="-1">
          {track.track.is_local ? (
            <div>
              <img
                aria-hidden="false"
                loading="eager"
                width={40}
                height={40}
                src={`https://media.wnyc.org/i/320/320/l/80/1/blackbox.jpeg`}
                alt="playlist-image1"
              ></img>
            </div>
          ) : (
            <div>
              {track.track.album.images && (
                <img
                  aria-hidden="false"
                  loading="eager"
                  width={40}
                  height={40}
                  src={track.track.album.images[0].url}
                  alt="playlist-image2"
                ></img>
              )}
            </div>
          )}

          <div className="TitleArtist">
            <div className="standalone-ellipsis-one-line PlaylistTrackTitle" tabIndex="-1">
              {track.track.name}
            </div>
            <div className="ArtistSpacing standalone-ellipsis-one-line">{artistsStr}</div>
          </div>
        </div>
        <div className="GridWidthScaling" role="gridcell" aria-colindex="3" tabIndex="-1">
          <span className="standalone-ellipsis-one-line ArtistAlbumDateDurFont">
            {track.track.album.name}
          </span>
        </div>
        <div className="GridWidthScaling" role="gridcell" aria-colindex="4" tabIndex="-1">
          <span className="ArtistAlbumDateDurFont">{getTimeSince(dateAdded)}</span>
        </div>
        <div className="FlexCenter" role="gridcell" aria-colindex="5" tabIndex="-1">
          <div className="DurationStyle ArtistAlbumDateDurFont">
            {msToMinutesAndSeconds(track.track.duration_ms)}
          </div>
        </div>
      </div>
    </div>
  )
}

function msToMinutesAndSeconds(ms) {
  var minutes = Math.floor(ms / 60000)
  var seconds = ((ms % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

function getTimeSince(date) {
  let dateNow = Date.now()
  let dateAdded = new Date(date)
  let days = Math.abs(dateNow - dateAdded) / (1000 * 60 * 60 * 24)
  if (days < 7) {
    return moment(dateAdded).startOf('second').fromNow()
  } else {
    return moment(dateAdded).format('MMM DD, YYYY')
  }
}

function artistsString(artistArr) {
  let tempArr = artistArr.map((artist) => {
    return artist.name
  })
  return tempArr.join(', ')
}
