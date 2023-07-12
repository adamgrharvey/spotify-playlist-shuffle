import '../CSS/Track.css';

export default function Track(props) {

  let track = props.track;
  let key = props.key;
  let index = props.index;


  return (
    <div role="row" className='Track' aroa-aria-rowindex={`${key + 1}`} key={`track${key}`}>
      <div role='gridcell' aria-aria-colindex={1} tabIndex={-1}>{`${index + 1}`}</div>
      <div className='imgTitle' role='gridcell' aria-colindex={2} tabIndex={-1}>
        {track.track.album.images && <img width={42} height={42} src={track.track.album.images[0].url} alt="image"></img>}
        <div>
          <div>
            {`${track.track.name}`}
          </div>
          <div>
            {`${track.track.artists[0].name}`}
          </div>
        </div>
      </div>
      <div role='gridcell' aria-aria-colindex={3} tabIndex={-1}>{`${track.track.album.name}`}</div>
      <div role='gridcell' aria-aria-colindex={4} tabIndex={-1}>{`${msToMinutesAndSeconds(track.track.duration_ms)}`}</div>
    </div>
  )
}

function msToMinutesAndSeconds(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}