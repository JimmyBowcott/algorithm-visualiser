import { useRef } from 'react';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

const ArrayCard = ({title, to}) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        videoRef.current.play();
      };
    
      const handleMouseLeave = () => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      };

    return (
        <Link to={`/sort?type=${to}`} className="flex flex-col gap-2 items-center justify-center relative">
            <button className="flex flex-col gap-2 rounded-lg w-40 h-40 bg-slate-700 shadow-xl
            hover:text-orange-600 transition-colors p-4 pt-8"
            onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
                <div className="w-full h-auto">
                    <video
                        ref={videoRef}
                        src={`./previews/videos/arrays/${to}.mp4`}
                        poster={`./previews/thumbs/arrays/${to}.png`}
                        width="100%"
                        muted
                        loop
                        style={{ objectFit: 'cover', imageRendering: 'pixelated' }}
                    >
                    </video>
                </div>
                <h2 className="card-title text-lg font-semibold">{title}</h2>

            </button>
        </Link>
    )
}

ArrayCard.propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number,
    to: PropTypes.string
};

export default ArrayCard