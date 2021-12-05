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

;(async () => {
    await waitElementsLoaded('video').then(() => {
        document.querySelector('video').playbackRate = 3
    })

    window.addEventListener('yt-page-data-updated', () => {
        document.querySelector('video').playbackRate = 3
    })
})()