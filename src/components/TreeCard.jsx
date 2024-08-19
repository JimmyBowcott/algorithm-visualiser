import { useRef } from 'react';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import Line from "./Line";

const TreeCard = ({title, index, to, nHovered, highlightN, line=false}) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        highlightN(index);
        videoRef.current.play();
      };
    
      const handleMouseLeave = () => {
        highlightN(-1);
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      };

    return (
        <Link to={`/tree?type=${to}`}>
            <button className="flex flex-row items-center"
            onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
                <div className={`rounded-full w-40 h-40 bg-slate-700 shadow-xl border-2
                ${nHovered >= index ? 'text-orange-600 border-orange-600' : 'border-white'}
                flex flex-col gap-1 items-center justify-center relative transition-colors overflow-hidden`}>
                    <div className="w-full h-auto">
                        <video
                            ref={videoRef}
                            src={`./previews/videos/${to}.mp4`}
                            poster={`./previews/thumbs/${to}.png`}
                            width="100%"
                            muted
                            loop
                            style={{ objectFit: 'cover', imageRendering: 'pixelated' }}
                        >
                    </video>
                </div>
                    <h2 className="card-title text-lg font-semibold max-w-36">{title}</h2>
                </div>
                { line && <Line highlighted={nHovered > index} /> }
            </button>
        </Link>
    )
}

TreeCard.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string,
    index: PropTypes.number.isRequired,
    nHovered: PropTypes.number.isRequired,
    highlightN: PropTypes.func.isRequired,
    line: PropTypes.bool
};

export default TreeCard