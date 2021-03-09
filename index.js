import { useState, useEffect } from 'react';
import './FrontLens.css';

export function useFrontLens(projectDir, webstormLocalhost) {
    const [isCMDPressed, setIsCMDPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [hoveredElement, setHoveredElement] = useState(null);

    function getWebstormURL(objectDebugInstance) {
        if (Object.values(objectDebugInstance)[29]) {
            let elementEditorInfo = Object.values(objectDebugInstance)[29];
            if(elementEditorInfo["fileName"]) {
                let codeFileURL = elementEditorInfo["fileName"].split(projectDir)[1];
                let codeFileLineNum = elementEditorInfo.lineNumber;
                let codeFileColNum = elementEditorInfo.columnNumber;
                return (webstormLocalhost + "/api/file/" + codeFileURL + ":" + codeFileLineNum + ":" + codeFileColNum);
            }
        }
        if (Object.values(objectDebugInstance)[28]) {
            let elementEditorInfo = Object.values(objectDebugInstance)[28];
            if(elementEditorInfo["fileName"]) {
                let codeFileURL = elementEditorInfo["fileName"].split(projectDir)[1];
                let codeFileLineNum = elementEditorInfo.lineNumber;
                let codeFileColNum = elementEditorInfo.columnNumber;
                return (webstormLocalhost + "/api/file/" + codeFileURL + ":" + codeFileLineNum + ":" + codeFileColNum);
            }
        }
        return null;
    }

    function handleOnClickTest(e) {
        let webstormURL = getWebstormURL(Object.values(e.target)[0]);

        if (webstormURL && (e.metaKey || e.ctrlKey)) {
            let myWindow = window.open(webstormURL);
            let timer  = setTimeout(function() {
                myWindow.close();
            }, 300);
            return () => {
                clearTimeout(timer);
            }
        }
    }

    function handleMouseMove(e) {
        let hoverElement = document.elementFromPoint(e.clientX, e.clientY);
        setHoveredElement(hoverElement);
        //if cmd or ctrl key is pressed
        if (e.metaKey || e.ctrlKey) {
            hoverElement.setAttribute('data-element-name', hoverElement.tagName);
        } else {
            hoverElement.removeAttribute('data-element-name');
        }
    }

    function handleOnCMDDown(e) {
        if (e.metaKey || e.ctrlKey) setIsCMDPressed(true);
        if (e.shiftKey) setIsShiftPressed(true);
    }

    function handleOnCMDUp(e) {
        //e.keyCode === 224 -> command key
        if (e.isComposing ||e.keyCode === 224) setIsCMDPressed(false);
        //e.keyCode === 16 -> shift key
        if (e.isComposing ||e.keyCode === 16) setIsShiftPressed(false);
    }

    useEffect(() => {
        if (isCMDPressed) {
            document.body.classList.add("cmd-select-style");
        } else {
            document.body.classList.remove("cmd-select-style");
        }
    },[isCMDPressed]);

    useEffect(() => {
        if (isShiftPressed && hoveredElement) {
            if (hoveredElement.getAttribute('class')) {
                hoveredElement.setAttribute(
                    'data-class-name',
                    "." + hoveredElement.getAttribute('class')
                );
            }
        } else {
            if (hoveredElement) hoveredElement.removeAttribute('data-class-name');
        }
    },[isShiftPressed]);

    useEffect(() => {
        document.addEventListener("click", handleOnClickTest);
        document.addEventListener("mousemove",handleMouseMove);
        document.addEventListener("keydown",handleOnCMDDown);
        document.addEventListener("keyup",handleOnCMDUp);
        return () => {
            document.removeEventListener("click", handleOnClickTest);
            document.removeEventListener("mousemove",handleMouseMove);
            document.removeEventListener("keydown",handleOnCMDDown);
            document.removeEventListener("keyup",handleOnCMDUp);
        };
    },[]);
}