import React from 'react'
import {  useEffect } from 'react'
import { useRef } from 'react'


const Video = props => {

    const link = props.link;
    const name = props.name;
    const iframeRef = useRef(null);

    useEffect(() => {
        const height = iframeRef.current.offsetWidth * 9 / 16 + 'px';
        iframeRef.current.setAttribute('height', height);
    }, []);

    return (
        <div className="video">
            <div className="video__title">
                <h2>{name}</h2>
            </div>
            <iframe
                src={link}
                ref={iframeRef}
                width="100%"
                title="video"
            ></iframe>
        </div>
    )
}

export default Video
