/*
 * License: MIT
 * LukeAz => https://github.com/LukeAz
*/

function findByXPath(path) {
    let result = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    let results = []; 
    while(x = result.iterateNext())
        results.push(x);
    return results;
}

function getElements () {
    return [
        findByXPath('//body')[0],
        findByXPath('//nav')[0],
        findByXPath('//div[contains(@class, "nav flex-column nav-pills justify-content-center")]')[0],
        findByXPath('//a[contains(@class, "nav-link")]'),
        findByXPath('//div[contains(@class, "col ")]')[0],
        findByXPath('//div[contains(@class, "tab-content")]')[0],
        findByXPath('//div[contains(@class, "mytab")]'),
        findByXPath('//span[contains(@class, "switch ")]'),
        findByXPath('//a[contains(@class, "nav-link")]/img')
    ];
}

function darkToggle (elements) {
    elements[0].className = elements[0].className.replace('darkBody', '');
    elements[1].className = elements[1].className.replace('navbar-dark bg-dark','navbar-light bg-light');
    elements[2].className = elements[2].className.replace('bg-dark', 'bg-light');
    elements[3][0].className = elements[3][0].className.replace('darkBar', 'whiteBar');
    elements[3][1].className = elements[3][1].className.replace('darkBar', 'whiteBar');
    elements[3][2].className = elements[3][2].className.replace('darkBar', 'whiteBar');
    elements[4].className = elements[4].className.replace('darkBody', '');
    elements[5].className = elements[5].className.replace('text-light', 'text-dark');
    elements[6][0].className = elements[6][0].className.replace('bg-dark', '');
    elements[6][1].className = elements[6][1].className.replace('bg-dark', '');
    elements[6][2].className = elements[6][2].className.replace('bg-dark', '');
    elements[6][3].className = elements[6][3].className.replace('bg-dark', '');
    elements[6][4].className = elements[6][4].className.replace('bg-dark', '');
    elements[6][5].className = elements[6][5].className.replace('bg-dark', '');
    elements[6][6].className = elements[6][6].className.replace('bg-dark', '');
    elements[7][0].className = elements[7][0].className.replace('darkBody', 'lightBody');
    elements[8][0].src = elements[8][0].src.replace('tempDark', 'temp');
    elements[8][1].src = elements[8][1].src.replace('settingDark', 'setting');
    elements[8][2].src = elements[8][2].src.replace('infoDark', 'info');
}

function whiteToggle (elements) {
    elements[0].className = elements[0].className + 'darkBody';
    elements[1].className = elements[1].className.replace('navbar-light bg-light','navbar-dark bg-dark');
    elements[2].className = elements[2].className.replace('bg-light', 'bg-dark');
    elements[3][0].className = elements[3][0].className.replace('whiteBar', 'darkBar');
    elements[3][1].className = elements[3][1].className.replace('whiteBar', 'darkBar');
    elements[3][2].className = elements[3][2].className.replace('whiteBar', 'darkBar');
    elements[4].className = elements[4].className + ' darkBody';
    elements[5].className = elements[5].className.replace('text-dark', 'text-light');
    elements[6][0].className = elements[6][0].className + ' bg-dark';
    elements[6][1].className = elements[6][1].className + ' bg-dark';
    elements[6][2].className = elements[6][2].className + ' bg-dark';
    elements[6][3].className = elements[6][3].className + ' bg-dark';
    elements[6][4].className = elements[6][4].className + ' bg-dark';
    elements[6][5].className = elements[6][5].className + ' bg-dark';
    elements[6][6].className = elements[6][6].className + ' bg-dark';
    elements[7][0].className = elements[7][0].className.replace('lightBody', 'darkBody');
    elements[8][0].src = elements[8][0].src.replace('temp', 'tempDark');
    elements[8][1].src = elements[8][1].src.replace('setting', 'settingDark');
    elements[8][2].src = elements[8][2].src.replace('info', 'infoDark');
}

function toggleSwitch(s) {
    s.onclick = () => {
        s.classList.toggle('active');
        if(s.classList.contains('switchDark')) {
            let dark = localStorage.getItem('darkModeToggle');
            let elements = getElements();
            if(dark=='true') {
                darkToggle(elements); 
                localStorage.setItem('darkModeToggle', false);
            } else {
                whiteToggle(elements);
                localStorage.setItem('darkModeToggle', true);
            } 
        }
    }
    
}
toggleSwitch(document.querySelector('.switchDark'));

let dark = localStorage.getItem('darkModeToggle');
if (dark!=null) {
    if (dark=='true') {
        document.querySelector('.switchDark').classList.toggle('active');
        let elements = getElements();
        whiteToggle(elements);
    }
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    let elements = getElements();
    document.querySelector('.switchDark').classList.toggle('active');
    whiteToggle(elements);
    localStorage.setItem('darkModeToggle', true);
}
