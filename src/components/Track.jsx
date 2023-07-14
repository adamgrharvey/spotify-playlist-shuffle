import '../CSS/Track.css';
import moment from 'moment';

export default function Track(props) {

  let track = props.track;
  let index = props.index;
  let dateAdded = props.track.added_at;


  return (
    <tr className='Track'>
      <td className='LabelTrackNumber'>{`${index + 1}`}</td>
      <td>
        {track.track.album.images && <img width={42} height={42} src={track.track.album.images[0].url} alt="image"></img>}
        <div className='TitleArtist'>
          <span id='Title' className='standalone-ellipsis-one-line'>
            {`${track.track.name}`}
          </span>
          <span>
            {`${track.track.artists[0].name}`}
          </span>
        </div>
      </td>
      <td className='standalone-ellipsis-one-line'>{`${track.track.album.name}`}</td>
      <td>{`${getTimeSince(dateAdded)}`}</td>
      <td className='duration'>{`${msToMinutesAndSeconds(track.track.duration_ms)}`}</td>
    </tr>
  )
}

function msToMinutesAndSeconds(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function getTimeSince(date) {
  let dateNow = Date.now();
  let dateAdded = new Date(date);
  let days = Math.abs((dateNow) - (dateAdded)) / (1000 * 60 * 60 * 24);
  if (days < 7) {
    return moment(dateAdded).startOf('second').fromNow();
  } else {
    return moment(dateAdded).format('MMM DD, YYYY');
  }
}