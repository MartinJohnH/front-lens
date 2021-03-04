import { useState, useEffect } from 'react';

export function useFrontLens() {
    const [isCMDPressed, setIsCMDPressed] = useState(false);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [hoveredElement, setHoveredElement] = useState(null);

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
        //document.addEventListener("click", handleOnClickTest);
        document.addEventListener("keydown",handleOnCMDDown);
        document.addEventListener("keyup",handleOnCMDUp);
        document.addEventListener("mousemove",handleMouseMove);
        return () => {
            //document.removeEventListener("click", handleOnClickTest);
            document.removeEventListener("keydown",handleOnCMDDown);
            document.removeEventListener("keyup",handleOnCMDUp);
            document.removeEventListener("mousemove",handleMouseMove);
        };
    },[]);
}