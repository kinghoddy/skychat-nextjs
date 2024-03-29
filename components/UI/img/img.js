import React from "react";
import classes from './img.module.css';
import Spinner from '../Spinner/Spinner';

export default ({ isFeed, onClick, src, maxHeight = "unset", spinner = false, alt = "Image cant be loaded", objectFit = "cover" }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [isValidSrc, setIsValidSrc] = React.useState(true);
    let img = React.createRef();

    return (
        <div className={classes.wrapper} style={{ height: (isFeed && !imageLoaded) ? '60vh' : '100%' }}>
            {isValidSrc ? (
                <img
                    onClick={onClick}
                    ref={img}
                    className={(imageLoaded ? classes.visible : '') + (isFeed ? '' : ' bg-light')}
                    style={{ objectFit, maxHeight }}
                    src={src}
                    alt={alt}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setIsValidSrc(false)}
                />
            ) : (
                    <div className={classes.noImg}>{alt}</div>
                )}
            {isValidSrc && !imageLoaded && <div className={classes.preload} >
                {!spinner && <div className="spinner-border text-danger" />}
            </div>
            }
        </div>
    );
};