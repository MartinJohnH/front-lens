import { useState, useEffect } from 'react';
//require('dotenv').config();

export function useFrontLens() {
    const [isCMDPressed, setIsCMDPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [hoveredElement, setHoveredElement] = useState(null);

    // function handleOnClickTest(e) {
    //     let objectDebugInstance = Object.values(e.target)[0];
    //     if ((e.metaKey || e.ctrlKey) && Object.values(objectDebugInstance)[29]) {
    //         let elementEditorInfo = Object.values(objectDebugInstance)[29];
    //         if (elementEditorInfo) {
    //             console.log(Object.values(objectDebugInstance));
    //             let elementURL = elementEditorInfo.fileName.split(process.PROJECT_DIR)[1];
    //             let myWindow = window.open(process.WEBSTORM_LOCALHOST + elementURL + ":" + elementEditorInfo.lineNumber + ":" + elementEditorInfo.columnNumber);
    //             let timer  = setTimeout(function(){
    //                 myWindow.close();
    //             }, 300);
    //
    //             return () => {
    //                 clearTimeout(timer);
    //             }
    //         }
    //     }
    // }

    function handleOnCMDDown(e) {
        if (e.metaKey || e.ctrlKey) {
            setIsCMDPressed(true);
        }
        if (e.shiftKey) {
            setIsShiftPressed(true);
        }
    }

    function handleOnCMDUp(e) {
        //e.keyCode === 224 -> command key
        if (e.isComposing ||e.keyCode === 224) {
            setIsCMDPressed(false);
        }
        //e.keyCode === 16 -> shift key
        if (e.isComposing ||e.keyCode === 16) {
            setIsShiftPressed(false);
        }
    }

    function handleMouseMove(e) {
        let hoverElement = document.elementFromPoint(e.clientX, e.clientY);
        setHoveredElement(hoverElement);
        if(e.metaKey || e.ctrlKey) {
            hoverElement.setAttribute('data-element-name', hoverElement.tagName);
        } else {
            hoverElement.removeAttribute('data-element-name');
        }
    }

    useEffect(() => {
        if(isShiftPressed && hoveredElement && hoveredElement.getAttribute('class')){
            hoveredElement.setAttribute(
                'data-class-name',
                "." + hoveredElement.getAttribute('class')
            );
        } else {
            if(hoveredElement){
                hoveredElement.removeAttribute('data-class-name');
            }
        }
    },[isShiftPressed]);

    useEffect(() => {
        if(isCMDPressed){
            document.body.classList.add("cmd-select-style");
        } else {
            document.body.classList.remove("cmd-select-style");
        }
    },[isCMDPressed]);

    useEffect(() => {
        document.addEventListener("click", handleOnClickTest);
        document.addEventListener("keydown",handleOnCMDDown);
        document.addEventListener("keyup",handleOnCMDUp);
        document.addEventListener("mousemove",handleMouseMove);
        return () => {
            document.removeEventListener("click", handleOnClickTest);
            document.removeEventListener("keydown",handleOnCMDDown);
            document.removeEventListener("keyup",handleOnCMDUp);
            document.removeEventListener("mousemove",handleMouseMove);
        };
    },[]);
}