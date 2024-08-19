import { useRef } from 'react';
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

const GraphCard = ({title, to}) => {
    const videoRef = useRef(null);

    const handleMouseEnter = () => {
        videoRef.current.play();
      };
    
      const handleMouseLeave = () => {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      };

    return (
        <div className="relative -mr-0.5 -mb-0.5">
            {/* Extended lines */}
            <svg height="20" width="10" className="absolute -top-4 -left-1">
                <line x1="5" y1="20" x2="5" y2="0" className="stroke-2 stroke-white" />
            </svg>
            <svg height="20" width="10" className="absolute -top-4 -right-1">
                <line x1="5" y1="20" x2="5" y2="0" className="stroke-2 stroke-white" />
            </svg>
            <svg height="10" width="20" className="absolute -top-1 -left-4">
                <line x1="20" y1="5" x2="0" y2="5" className="stroke-2 stroke-white" />
            </svg>
            <svg height="10" width="20" className="absolute -top-1 -right-4">
                <line x1="20" y1="5" x2="0" y2="5" className="stroke-2 stroke-white" />
            </svg>
            <svg height="20" width="10" className="absolute -bottom-4 -left-1">
                <line x1="5" y1="20" x2="5" y2="0" className="stroke-2 stroke-white" />
            </svg>
            <svg height="20" width="10" className="absolute -bottom-4 -right-1">
                <line x1="5" y1="20" x2="5" y2="0" className="stroke-2 stroke-white" />
            </svg>
            <svg height="10" width="20" className="absolute -bottom-1 -left-4">
                <line x1="20" y1="5" x2="0" y2="5" className="stroke-2 stroke-white" />
            </svg>
            <svg height="10" width="20" className="absolute -bottom-1 -right-4">
                <line x1="20" y1="5" x2="0" y2="5" className="stroke-2 stroke-white" />
            </svg>

            {/* The actual box */}
            <Link to={`/graph?type=${to}`} className="flex flex-col gap-2 items-center justify-center">
                <button className="flex flex-col gap-2 w-40 h-40 bg-slate-700 shadow-xl
                hover:text-orange-600 transition-colors p-4 pt-8 border-2 border-white"
                onMouseEnter={() => handleMouseEnter()} onMouseLeave={() => handleMouseLeave()}>
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
                    <h2 className="card-title text-lg font-semibold">{title}</h2>

                </button>
            </Link>
        </div>
    )
}

GraphCard.propTypes = {
    title: PropTypes.string.isRequired,
    index: PropTypes.number,
    to: PropTypes.string
};

export default GraphCard