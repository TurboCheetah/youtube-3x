// ==UserScript==
// @name         YouTube 3x
// @namespace    https://turbo.ooo
// @version      1.0
// @description  Simple userscript to automatically play YouTube videos at 3x speed
// @author       Turbo
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at document-start
// ==/UserScript==

const sleep = async timeout => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), timeout)
    })
}

const waitElementsLoaded = async (...elementsQueries) => {
    return Promise.all(
        elementsQueries.map(async ele => {
            return new Promise(async resolve => {
                while (!document.querySelector(ele)) {
                    await sleep(100)
                }
                resolve()
            })
        })
    )
}

const getFormattedTime = (seconds, precise) => {
    seconds = Math.max(seconds, 0);
        
    const hours = Math.floor(seconds / 60 / 60);
    const minutes = Math.floor(seconds / 60) % 60;
    let minutesDisplay = String(minutes);
    let secondsNum = seconds % 60;
    if (!precise) {
        secondsNum = Math.floor(secondsNum);
    }

    let secondsDisplay = String(precise ? secondsNum.toFixed(3) : secondsNum);
    
    if (secondsNum < 10) {
        //add a zero
        secondsDisplay = "0" + secondsDisplay;
    }
    if (hours && minutes < 10) {
        //add a zero
        minutesDisplay = "0" + minutesDisplay;
    }
    if (isNaN(hours) || isNaN(minutes)) {
        return null;
    }

    const formatted = (hours ? hours + ":" : "") + minutesDisplay + ":" + secondsDisplay;

    return formatted;
}

const speedUp = (videoElement) => {
    videoElement.playbackRate = 3

    // YouTube player time display
    const display = document.querySelector(".ytp-time-display.notranslate")
    if (!display) return

    const durationID = "durationAfterSpeedUp"
    let duration = document.getElementById(durationID)

    // Create span if needed
    if (duration === null) {
        duration = document.createElement('span')
        duration.id = durationID
        duration.classList.add("ytp-time-duration")

        display.appendChild(duration)
    }

    const durationAfterSpeedUp = getFormattedTime(videoElement.duration / 3)

    duration.innerText = (durationAfterSpeedUp == null || skippedDuration <= 0) ? "" : " (" + durationAfterSpeedUp + ")";

}

;(async () => {

    await waitElementsLoaded('video').then(() => {
        speedUp(document.querySelector('video'))
    })

    window.addEventListener('yt-page-data-updated', () => {
        speedUp(document.querySelector('video'))
    })
})()