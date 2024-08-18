import { useEffect, useRef, useState } from 'react';
import PropTypes from "prop-types";

const TreeConnection = ({from, to}) => {
    const svgRef = useRef(null);
    const [lineCoordinates, setLineCoordinates] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  
    useEffect(() => {
      const childElement = document.getElementById(from);
      const parentElement = document.getElementById(to);
  
      if (childElement && parentElement && svgRef.current) {
        const updateLinePosition = () => {
          const childPos = childElement.getBoundingClientRect();
          const parentPos = parentElement.getBoundingClientRect();
          const svgPos = svgRef.current.getBoundingClientRect();
  
          // Calculate the center of the child and parent elements relative to the SVG container
          const x1 = childPos.left + childPos.width / 2 - svgPos.left;
          const y1 = childPos.top + childPos.height / 2 - svgPos.top;
          const x2 = parentPos.left + parentPos.width / 2 - svgPos.left;
          const y2 = parentPos.top + parentPos.height / 2 - svgPos.top;
  
          setLineCoordinates({ x1, y1, x2, y2 });
        };
  
        // Set initial position
        updateLinePosition();
  
        // Update the line position on window resize
        window.addEventListener('resize', updateLinePosition);
  
        return () => {
          window.removeEventListener('resize', updateLinePosition);
        };
      }
    }, [from, to]);
  
    return (
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9,
        }}
      >
        <line
          x1={lineCoordinates.x1}
          y1={lineCoordinates.y1}
          x2={lineCoordinates.x2}
          y2={lineCoordinates.y2}
          stroke="white"
          strokeWidth="2"
        />
      </svg>
    );
  };

TreeConnection.propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
}

export default TreeConnection;