import '../CSS/Playlist.css';
import '../CSS/Track.css';
import countPlaylistDuration from './helpers/countPlaylistDuration';
import Track from './Track';
import { useState, useEffect } from 'react';

export default function Playlist(props) {
  const [AriaCol, setAriaCol] = useState(5);

  const updateMedia = () => {
    console.log(window.innerWidth);
    if (window.innerWidth < 840) {
      setAriaCol(3);
      return;
    }
    else if (window.innerWidth >= 840 && window.innerWidth < 1080) {
      setAriaCol(4);
      return;
    }
    else {
      setAriaCol(5);
      return;
    }
  };


  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });


  // gets window width on first page load to set Aria cols correctly.
  useEffect(() => {
    updateMedia();
  }, [])


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
      <div className="contentSpacing">
        <div role="grid" aria-rowcount={`${currPlaylist.tracks.length + 1}`} aria-colcount={`${AriaCol}`} aria-label={`${currPlaylist.data.name}`} className="PlaylistGrid WidthToggle" tabIndex="0">
          <div className="HeaderStyle" style={{ top: "0px" }} role="presentation">
            <div className="PlaylistHeader GridSizing" role="row" aria-rowindex="1">
              <div className="PlaylistIndexSpacing" role="columnheader" aria-colindex="1" aria-sort="none" tabIndex="-1">#</div>
              <div className="PlaylistTitle" role="columnheader" aria-colindex="2" aria-sort="none" tabIndex="-1">
                <div className="FlexCenter">
                  <span className="standalone-ellipsis-one-line">Title</span>
                </div>
              </div>
              <div className="GridWidthScaling" role="columnheader" aria-colindex="3" aria-sort="none" tabIndex="-1">
                <div className="FlexCenter">
                  <span className="standalone-ellipsis-one-line">Album</span>
                </div>
              </div>
              <div className="GridWidthScaling" role="columnheader" aria-colindex="4" aria-sort="none" tabIndex="-1">
                <div className="FlexCenter"><span className="standalone-ellipsis-one-line">Date added</span>
                </div>
              </div>
              <div className="FlexCenter" role="columnheader" aria-colindex="5" aria-sort="none" tabIndex="-1">
                <div aria-label="Duration" className="FlexCenter DurationSpacing" aria-expanded="false">
                  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" className="durationClock">
                    <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                    <path d="M8 3.25a.75.75 0 0 1 .75.75v3.25H11a.75.75 0 0 1 0 1.5H7.25V4A.75.75 0 0 1 8 3.25z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="" role="presentation">
            <div role="presentation" />
            <div role="presentation" style={{ transform: "translateY(0px)" }}>
              {(currPlaylist.next === null) && currPlaylist.shuffleTracks.map((track, i) =>
                <Track index={i} key={i + 1} track={track} />)}
            </div>
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
