/*
 * Terrain Generator
 * 2023 - Anderson Bucchianico
 *
*/

let menuOptionContainer = document.querySelector('#menu-option-detail');
let menuOptionName = document.querySelector('#menu-option-name');
let menuSliderContainer = document.querySelector("#slider-container");
let inputSlider = document.querySelector("input[type='range']");
let sliderInputNumber = document.querySelector("input#slider-value");

let activeMenuOptionButton;
let intervalNightCycleId;

let isHoverOnOptionsEnabled = true;
let isDayNightCycleEnabled = false;

function clickInMenuOption(event) {
    cleanMenuOptionState(event.target);

    if (isOptionActivated(event.target)) {
        removeActivatedOptions();
        event.target.classList.remove("activated");
    } else {
        activateMenuOption(event.target);
        removeActivatedOptions();
        event.target.classList.add("activated");
    }

    if (event.target.dataset['type'] == 'toggle') {
        Module[event.target.dataset['function']]();
    }
    
    if (event.target.dataset['type'] == 'toggleUI') {
        this[event.target.dataset['function']]();
    }

    if (window.innerWidth < 480) {
        event.target.dispatchEvent(new Event("mouseleave"));
    }
}

function hoverInMenuOption(event) {
    if (isHoverOnOptionsEnabled) {
        menuOptionContainer.style.transform = `translateY(${getBoundingClientRect(event.target).top}px)`;
        menuOptionName.innerText = event.target.dataset['title'];
    }
}
function hoverOutMenuOption(event) {
    if (isHoverOnOptionsEnabled) {
        menuOptionContainer.style.transform = null;
    }
}

function activateMenuOption(element) {
    if (element.dataset['type'] == 'range') {
        activeMenuOptionButton = element;
        inputSlider.min = element.dataset['minvalue'];
        inputSlider.step = element.dataset['step'];
        inputSlider.max = element.dataset['maxvalue'];
        inputSlider.value = element.value;
        sliderInputNumber.value = element.value;
        isHoverOnOptionsEnabled = false;
        menuSliderContainer.style.display = 'flex';
    }
}

function cleanMenuOptionState(option) {
    isHoverOnOptionsEnabled = true;
    menuSliderContainer.style.display = null;
    menuOptionContainer.style.transform = `translateY(${getBoundingClientRect(option).top}px)`;
    menuOptionName.innerText = option.dataset['title'];
}

function removeActivatedOptions() {
    Array.from(document.querySelector("section").children).forEach( button => {
        if (button.dataset.type == "range") {
            button.classList.remove("activated");
        }
    });
}

function isOptionActivated(element) {
    return element.classList.contains('activated');
}

function changeSliderOptionValue(event) {
    sliderInputNumber.value = event.target.value;
    activeMenuOptionButton.value = event.target.value;
    Module[activeMenuOptionButton.dataset['function']](event.target.value);
    if (activeMenuOptionButton.dataset['function'] == 'setTerrainLight') {
        updateInterfaceColor(calcInterfaceColorFactor(event.target.value));
    }
}

function toggleInterfaceConsole() {
    let consoleStyle = document.querySelector("#console-container").style;
    consoleStyle.display = (consoleStyle.display == '') ? 'flex' : '';
}

function clearConsole(event) {
    let outputConsole = document.querySelector("p#output");
    outputConsole.innerHTML = "";
}

function toggleDayNightCycle() {
    isDayNightCycleEnabled = (isDayNightCycleEnabled) ? false : true ;
    if (isDayNightCycleEnabled) {
        intervalNightCycleId = setInterval(() => {
            let dayNightButton = document.querySelector("#light");
            dayNightButton.value = Number(dayNightButton.value) + 1;
            if (Number(dayNightButton.value) > 1440) {
                dayNightButton.value = "0";
            }
            Module.setTerrainLight(dayNightButton.value);
            updateInterfaceColor(calcInterfaceColorFactor(Number(dayNightButton.value)));
        }, 33);
    } else {
        clearInterval(intervalNightCycleId);
    }
}
                                          
function calcInterfaceColorFactor( value ) {
    return Math.abs(1-(value / 720));
}

function updateInterfaceColor(interfaceColorFactor) {
    let root = document.querySelector(":root");
    
    const backgroundColorDay = {r:56, g:68, b:104};
    const backgroundColorNight = {r:26, g:32, b:49};
    const buttonColorDay = {r:88, g:110, b:153};
    const buttonColorNight = {r:48, g:60, b:84};
    
    const mixedBkg = mixColor(backgroundColorDay, backgroundColorNight, interfaceColorFactor);
    const mixedBtn = mixColor(buttonColorDay, buttonColorNight, interfaceColorFactor);
    root.style.setProperty('--background-color', `rgb(${mixedBkg.r} ${mixedBkg.g} ${mixedBkg.b} / 89%)`);
    root.style.setProperty('--button-color', `rgb(${mixedBtn.r} ${mixedBtn.g} ${mixedBtn.b} / 89%)`);
}

function mixColor(base, topColor, weight) {
    return {
         r: base.r * (1-weight) + topColor.r * weight,
         g: base.g * (1-weight) + topColor.g * weight,
         b: base.b * (1-weight) + topColor.b * weight
    };
}

var Module = {
    arguments: [
        `-ww${window.innerWidth}`,
        `-wh${window.innerHeight}`,
        `-ts64`,
        `-tl720`,
    ],
    print: (function() {
        var element = document.getElementById('output');
        return function(text) {
            element.innerHTML += text + "<br>";
        };
    })(),
    printErr: function(text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');
            if (0) {
                dump(text + '\n');
            }
    },
    canvas: (function() {
        var canvas = document.getElementById('canvas');
        return canvas;
    })()
};
                       
updateInterfaceColor(calcInterfaceColorFactor(720));
