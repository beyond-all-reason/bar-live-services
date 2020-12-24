import "../styles/styles.scss";

import "iframe-resizer/js/iframeResizer.contentWindow";

declare var __IS_DEV__: boolean;

const insideIframe = window !== window.parent;

if (__IS_DEV__ || !insideIframe) {
    document.body.classList.add("dev");
}