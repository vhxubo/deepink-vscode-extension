/**
 * The JSONFormatter helper module. This contains two major functions, jsonToHTML and errorPage,
 * each of which returns an HTML document.
 * https://github.com/bhollis/jsonview
 */

/** Convert a whole JSON value / JSONP response into a formatted HTML document */
export function jsonToHTML(json: any) {
    return jsonToHTMLBody(json);
}

/** Convert a whole JSON value / JSONP response into an HTML body, without title and scripts */
function jsonToHTMLBody(json: any) {
    return `<div id="json">${valueToHTML(json, '<root>')}</div>`;
}

/**
 * Encode a string to be used in HTML
 */
function htmlEncode(t: any): string {
    return (typeof t !== "undefined" && t !== null) ? t.toString()
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        : '';
}

/**
 * Completely escape a json string
 */
function jsString(s: string): string {
    // Slice off the surrounding quotes
    s = JSON.stringify(s).slice(1, -1);
    return htmlEncode(s);
}

/**
 * Is this a valid "bare" property name?
 */
function isBareProp(prop: string): boolean {
    return /^[A-Za-z_$][A-Za-z0-9_\-$]*$/.test(prop);
}

/**
 * Surround value with a span, including the given className
 */
function decorateWithSpan(value: any, className: string) {
    return `<span class="${className}">${htmlEncode(value)}</span>`;
}

// Convert a basic JSON datatype (number, string, boolean, null, object, array) into an HTML fragment.
function valueToHTML(value: any, path: string) {
    const valueType = typeof value;

    if (value === null) {
        return decorateWithSpan('null', 'null');
    } else if (Array.isArray(value)) {
        return arrayToHTML(value, path);
    } else if (valueType === 'object') {
        return objectToHTML(value, path);
    } else if (valueType === 'number') {
        return decorateWithSpan(value, 'num');
    } else if (valueType === 'string' &&
        value.charCodeAt(0) === 8203 &&
        !isNaN(value.slice(1))) {
        return decorateWithSpan(value.slice(1), 'num');
    } else if (valueType === 'string') {
        if (/^(http|https|file):\/\/[^\s]+$/i.test(value)) {
            return `<a href="${htmlEncode(value)}"><span class="q">&quot;</span>${jsString(value)}<span class="q">&quot;</span></a>`;
        } else {
            return `<span class="string">&quot;${jsString(value)}&quot;</span>`;
        }
    } else if (valueType === 'boolean') {
        return decorateWithSpan(value, 'bool');
    }

    return '';
}

// Convert an array into an HTML fragment
function arrayToHTML(json: any, path: string) {
    if (json.length === 0) {
        return '[ ]';
    }

    let output = '';
    for (let i = 0; i < json.length; i++) {
        const subPath = `${path}[${i}]`;
        output += '<li>' + valueToHTML(json[i], subPath);
        if (i < json.length - 1) {
            output += ',';
        }
        output += '</li>';
    }
    return (json.length === 0 ? '' : '<span class="collapser"></span>') +
        `[<ul class="array collapsible">${output}</ul>]`;
}

// Convert a JSON object to an HTML fragment
function objectToHTML(json: any, path: string) {
    let numProps = Object.keys(json).length;
    if (numProps === 0) {
        return '{ }';
    }

    let output = '';
    for (const prop in json) {
        let subPath = '';
        let escapedProp = JSON.stringify(prop).slice(1, -1);
        const bare = isBareProp(prop);
        if (bare) {
            subPath = `${path}.${escapedProp}`;
        } else {
            escapedProp = `"${escapedProp}"`;
        }
        output += `<li><span class="prop${(bare ? '' : ' quoted')}" title="${htmlEncode(subPath)}"><span class="q">&quot;</span>${jsString(prop)}<span class="q">&quot;</span></span>: ${valueToHTML(json[prop], subPath)}`;
        if (numProps > 1) {
            output += ',';
        }
        output += '</li>';
        numProps--;
    }

    return `<span class="collapser"></span>{<ul class="obj collapsible">${output}</ul>}`;
}
