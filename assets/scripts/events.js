// NOTE! Do not add JavaScript code to your HTML files, rather use JavaScript files to add code to your pages.

const button = document.querySelector('button');

const control = function () {
    // Prompt the user to enter their name.
    let name = 'Edward'; //prompt('Please enter your name.');

    if (name) {
        // Store the name in localStorage.
        localStorage.setItem('name', name);

        // Get the result from localStorage.
        let message = 'Hello ' + localStorage.getItem('name');;

        // Using the <template> tag, get the template required for the result.
        const result = document.getElementById('result');

        // When using the <template> tag, you need to use the importNode() method to copy the content of the template tag.
        const resultBody = document.importNode(result.content, true);

        // Set the text content of the <p> tag to the message.
        resultBody.querySelector('p').textContent = message;

        // Append the result to the body.
        document.querySelector('body').append(resultBody);

        // Remove item from localStorage.
        localStorage.removeItem('name');
    }
}

const buttonClickHandler = () => {
    control();
}

const buttonClickHandlerEventData = (event) => {
    event.value = 'Hello World';

    // Disable the button.
    event.target.disabled = true;
    console.log(event.target);
}

/*
IMPORTANT! This is another way to add an event listener to an element. This is not the recommended way to add event listeners to elements.
//Adds a single event listener to the button. Not ideal for multiple events and it is better to use the addEventListener() method.
button.onclick = buttonClickHandler;
*/

// This has been added as an example.
const boundFunction = buttonClickHandler.bind(this);

// This will add two event listener to the button.
// Add an event listener to the button.
button.addEventListener('click', (e) => {
    buttonClickHandler();
    e.stopImmediatePropagation();
});
button.addEventListener('click', (e) => {
    boundFunction();
    e.stopImmediatePropagation();
});
button.addEventListener('click', (e) => {
    buttonClickHandlerEventData();
    e.stopImmediatePropagation();
});

setTimeout(() => {
    console.log('Removing event listener...');

    // Remove the event listener from the button.
    // It is very important to ensure that when removing an event listener, you use the same function name as the one used to add the event listener.
    // The trick is to store the function name in a variable and then use that variable to remove the event listener, so that it references the memory address of the function.
    button.removeEventListener('click', boundFunction);
    button.removeEventListener('click', buttonClickHandler);
    button.removeEventListener('click', buttonClickHandlerEventData);

    console.log('Event listener removed.');
}, 5000);

window.addEventListener('load', () => {
    console.log('Window loaded.');
});

window.addEventListener('scroll', (e) => {
    console.log('I have been scrolled.');
});

// Infinite scroll example.
let curElementNumber = 0;

function scrollHandler() {
    const distanceToBottom = document.body.getBoundingClientRect().bottom;

    if (distanceToBottom < document.documentElement.clientHeight + 150) {
        const newDataElement = document.createElement('div');
        curElementNumber++;
        newDataElement.innerHTML = `<p>Element ${curElementNumber}</p>`;
        document.body.append(newDataElement);
    }
}

window.addEventListener('scroll', scrollHandler);

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log(event);
});

// Event propagation.
const propagation = document.getElementById('propagation');
const div = document.querySelector('div');

// 
div.addEventListener('click', (event) => {
    console.log('Div clicked.');
},
    // If you want to switch the order of the event listeners, you can set the third parameter to true. This will make the event listener fire first.
    //true
);

propagation.addEventListener('click', (event) => {
    console.log('Propagation clicked.');

    // This prevents the event from bubbling up the DOM tree. If it was not in place, the event would bubble up to the div and trigger the event listener on the div.
    event.stopPropagation();

    // Useful when you have multiple event listeners on the same element.
    event.stopImmediatePropagation();
});

// Event delegation.
const listItems = document.querySelectorAll('li');
listItems.forEach(listItem => {
    listItem.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(event.target);
        event.target.classList.toggle('highlight');
    });
});