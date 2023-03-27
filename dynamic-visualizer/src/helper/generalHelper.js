import {apiEndpoints} from "./envConst";

/**
 * author https://natclark.com/tutorials/javascript-lighten-darken-hex-color/
 * 11.10.2022
 */
export const newShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};

// create unique id to select with d3 and reference with react
// const rnd from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/15456423
export const uniqueId = () => {
    const rnd = (len, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz') => [...Array(len)].map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('')
    return rnd(15);
}

// To get the requestUrl from props
export const getRequestUrl = (props) => {
    let requestUrl = props.url + props.selectedDocuments.join(",") + apiEndpoints.requestParamMinOccurrence + props.selectedMinOccurrence + apiEndpoints.requestParamMaxOccurrence + props.selectedMaxOccurrence + apiEndpoints.requestParamSorting + props.selectedSorting + apiEndpoints.requestParamPreserveNullAndEmptyArrays + props.selectedPreserveEmptyAndNull;

    if (props.lemmaEnd !== 0 && props.selectedDocuments.length === 1) {
        requestUrl = requestUrl + "&begin=" + props.lemmaBegin + "&end=" + props.lemmaEnd;
    }
    return requestUrl;
}
