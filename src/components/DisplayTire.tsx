import {calculateTireHeight} from '../../util/helpers';
import {tire} from "../../types/tire";


export default function DisplayTire({width, aspectRatio, wheelDiameter}: tire, handleClick: () => void) {
    return <span className="tire" onClick={() => handleClick()}>
        <span>{`${width}/${aspectRatio}R`}</span>
        <span style={{color: "#f00"}}>{wheelDiameter}</span>
        <span>{` ⇔ ${calculateTireHeight({width, aspectRatio, wheelDiameter})}"`}</span>
      </span>;
}
