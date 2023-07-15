import '../CSS/PlaylistHead.css';
import countPlaylistDuration from './helpers/countPlaylistDuration';

export default function PlaylistHead(props) {

  let currPlaylist = props.currPlaylist;

  return (
    <>
      <div className="PlaylistTitleImage">
        <div><img width={200} height={200} src={currPlaylist.data.images[0].url} alt="PlaylistImage"></img></div>
        <div>
          <div className={`PlaylistTitleLarge-${htmlDecode(currPlaylist.data.name).length > 16 ? `over11char` : `under12char`}`}>{htmlDecode(currPlaylist.data.name)}</div>
          <div className="PlaylistDesc">{htmlDecode(currPlaylist.data.description)} </div>
          <div className="PlaylistDetails">
            <span className="PlaylistOwner">{`${htmlDecode(currPlaylist.data.owner.display_name)} `}</span>
            <span>
              {currPlaylist.data.followers.total > 0 ? <span className="DotSpace">{`• ${currPlaylist.data.followers.total} likes `}</span> : ``}
            </span>
            <span className="DotSpace">{`• ${currPlaylist.tracks.length} songs, `}
            </span>
            <span className="PlaylistDuration">{countPlaylistDuration(currPlaylist)}
            </span>
          </div>
        </div>

      </div>
    </>
  )
}


function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}
